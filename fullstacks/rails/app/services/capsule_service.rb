# CapsuleService — 时间胶囊核心业务逻辑
#
# 职责：胶囊的创建、查询、分页列表、删除。
# 对应关系：与 Spring MVC 的 CapsuleService、FastAPI 的 capsule_service、
#           Gin 的 CapsuleService 承担相同职责，是各技术栈在业务层的统一抽象。
#
# 设计原则：
#   - 普通用户查询时，开启时间未到则隐藏 content（见 format_capsule）。
#   - 管理员调用 list_paginated 时，始终返回完整内容（hide_content=false）。
#   - code 生成使用 SecureRandom，最多重试 10 次以确保唯一性。

class CapsuleService
  # 胶囊码字符集：26 个大写字母 + 10 个数字 = 36 个字符，共 36^8 ≈ 28 亿种组合
  CHARS = ("A".."Z").to_a + ("0".."9").to_a

  # 创建时间胶囊
  #
  # @param params [Hash] 包含 :title, :content, :creator, :openAt (ISO8601 字符串)
  # @return [Capsule] 已持久化的 ActiveRecord 对象
  # @raise [ArgumentError] 当 openAt 不是未来时间时
  def create(params)
    open_at = Time.parse(params[:openAt]).utc
    raise ArgumentError, "openAt must be in the future" if open_at <= Time.now.utc

    code = generate_unique_code
    now = Time.now.utc

    # record_timestamps = false，需要手动赋值 created_at（无 updated_at 字段）
    Capsule.create!(
      code: code,
      title: params[:title],
      content: params[:content],
      creator: params[:creator],
      open_at: open_at,
      created_at: now
    )
  end

  # 根据 code 查询胶囊详情（普通访客视角）
  #
  # 核心业务规则：开启时间未到时，content 返回 nil，opened 返回 false，
  # 确保用户在到期前无法读取胶囊内容。
  #
  # @param code [String] 8 位大写字母 + 数字组合
  # @return [Hash, nil] 胶囊数据，胶囊不存在时返回 nil
  def get_by_code(code)
    capsule = Capsule.find_by(code: code)
    return nil unless capsule

    format_capsule(capsule, !capsule.opened?)
  end

  # 分页查询所有胶囊（管理员视角）
  #
  # 管理员可以看到所有胶囊的完整内容，无论是否已到开启时间（hide_content=false）。
  # 分页参数与 Spring Boot / FastAPI / Gin 保持一致：page 从 0 开始。
  #
  # @param page [Integer] 页码（从 0 开始）
  # @param size [Integer] 每页条数，默认 20
  # @return [Hash] 包含 content、totalElements、totalPages、number、size 的分页结构
  def list_paginated(page = 0, size = 20)
    total = Capsule.count
    items = Capsule.order(created_at: :desc).offset(page * size).limit(size)

    {
      content: items.map { |c| format_capsule(c, false) },
      totalElements: total,
      totalPages: (total.to_f / size).ceil,
      number: page,
      size: size
    }
  end

  # 删除指定胶囊（管理员功能）
  #
  # @param code [String] 8 位胶囊码
  # @return [Boolean] 删除成功返回 true，胶囊不存在返回 false
  def delete(code)
    capsule = Capsule.find_by(code: code)
    return false unless capsule

    capsule.destroy
    true
  end

  private

  # 将 Capsule 模型转为统一响应 Hash
  #
  # @param capsule [Capsule] ActiveRecord 实例
  # @param hide_content [Boolean] 为 true 时将 content 设为 nil
  #   - 普通访客：开启时间未到时 hide_content=true，保护胶囊内容不被提前读取
  #   - 管理员列表：始终 hide_content=false，管理员可查看所有内容
  def format_capsule(capsule, hide_content)
    opened = capsule.opened?
    {
      code: capsule.code,
      title: capsule.title,
      content: hide_content ? nil : capsule.content,
      creator: capsule.creator,
      openAt: capsule.open_at.utc.iso8601,
      createdAt: capsule.created_at.utc.iso8601,
      opened: opened
    }
  end

  # 生成唯一的 8 位胶囊码
  #
  # 使用 SecureRandom 作为随机源保证不可预测性，最多重试 10 次；
  # 碰撞概率极低（36^8 ≈ 28 亿），正常情况下一次即可生成。
  #
  # @raise [RuntimeError] 10 次内无法生成唯一码（极端情况）
  def generate_unique_code
    10.times do
      code = Array.new(8) { CHARS.sample(random: SecureRandom) }.join
      return code unless Capsule.exists?(code: code)
    end
    raise RuntimeError, "Failed to generate unique capsule code"
  end
end
