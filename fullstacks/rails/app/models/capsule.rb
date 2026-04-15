# Capsule — 时间胶囊 ActiveRecord 模型
#
# 对应数据库表 capsules，字段说明见 db/migrate/20240101000001_create_capsules.rb。
# 与其他技术栈共享同一个 SQLite 数据库文件（../../data/hellotime.db）。
#
# 两处非默认配置的原因：
#   primary_key = "code"    — 胶囊码即主键，业务上唯一标识胶囊，无需自增 ID
#   record_timestamps = false — 表中只有 created_at，无 updated_at，
#                              关闭 Rails 自动时间戳，避免写入时报错

class Capsule < ApplicationRecord
  self.primary_key = "code"
  self.record_timestamps = false

  validates :code, presence: true, length: { is: 8 }
  validates :title, presence: true, length: { maximum: 200 }
  validates :content, presence: true
  validates :creator, presence: true, length: { maximum: 100 }
  validates :open_at, presence: true

  # 判断胶囊是否已到开启时间
  #
  # 用于 CapsuleService#format_capsule：opened? 为 false 时隐藏内容，
  # 确保用户在 open_at 之前无法读取胶囊正文。
  # 时区统一使用 UTC，与入库时保持一致。
  def opened?
    open_at <= Time.now.utc
  end
end
