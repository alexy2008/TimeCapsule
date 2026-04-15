# Web::PagesController — 服务端渲染 MPA 页面控制器
#
# 职责：处理所有浏览器直接访问的 HTML 页面请求，使用 ERB 模板渲染。
# 对应关系：与 Spring MVC 的 WebController、Laravel 的 PagesController 承担相同职责，
#           是各技术栈"服务端渲染 MPA"出口的统一抽象。
#
# 认证方式：Rails Session（Cookie 存储），独立于 JSON API 的 JWT 认证。
#   原因：浏览器管理员操作依赖 HTML 表单和页面跳转，Session 更自然；
#         API 管理员操作无状态，JWT 更适合程序调用。
#
# 路由对应：见 config/routes.rb 中的 namespace :web 块

module Web
  class PagesController < ApplicationController
    # 首页：准备技术栈信息供模板渲染
    def home
      @tech_items = tech_items
      render "pages/home"
    end

    # 创建胶囊表单页
    #
    # @min_open_at 用于 input[type=datetime-local] 的 min 属性，
    # 限制用户选择的最早开启时间为当前时间 + 60 秒，服务端仍会二次校验。
    def create_form
      @min_open_at = (Time.now.utc + 60).strftime("%Y-%m-%dT%H:%M")
      render "pages/create"
    end

    # 创建胶囊表单提交
    #
    # 成功时将创建结果赋给 @created_capsule，失败时赋给 @create_error，
    # 最后统一 render 同一模板（create.html.erb 根据实例变量决定显示内容）。
    # 这里使用 render 而非 redirect_to，是为了在同一请求中保留表单回填数据。
    def create_submit
      @min_open_at = (Time.now.utc + 60).strftime("%Y-%m-%dT%H:%M")

      begin
        # datetime-local 输入格式为 "YYYY-MM-DDTHH:MM"（本地时间），需手动解析
        open_at = Time.strptime(params[:openAt], "%Y-%m-%dT%H:%M")
        open_at_iso = open_at.utc.iso8601

        capsule = CapsuleService.new.create(
          title: params[:title],
          content: params[:content],
          creator: params[:creator],
          openAt: open_at_iso
        )

        @created_capsule = {
          code: capsule.code,
          openAt: capsule.open_at.utc.iso8601
        }
      rescue ArgumentError => e
        @create_error = e.message
      end

      render "pages/create"
    end

    # 开启胶囊查询表单页（输入胶囊码）
    def open_form
      render "pages/open"
    end

    # 根据 code 显示胶囊详情
    #
    # 胶囊内容由 CapsuleService#get_by_code 控制隐藏逻辑（开启前 content 为 nil）。
    def open_by_code
      code = params[:code].to_s.strip.upcase
      data = CapsuleService.new.get_by_code(code)

      if data
        @capsule = data
      else
        @open_error = "未找到该胶囊，请确认胶囊码是否正确。"
        @lookup_code = code
      end

      render "pages/open"
    end

    # 处理查询表单提交，将用户输入的 code 重定向到对应详情页
    def open_search
      code = params[:code].to_s.strip.upcase
      if code.blank?
        redirect_to "/open"
      else
        redirect_to "/open/#{code}"
      end
    end

    # 关于页面：同样展示技术栈信息
    def about
      @tech_items = tech_items
      render "pages/about"
    end

    # 管理员页面
    #
    # Session 未登录时渲染登录表单（@capsules 为空，模板显示登录区域）；
    # 已登录时查询分页胶囊列表并渲染管理面板。
    def admin
      unless session[:admin_logged_in]
        return render("pages/admin")
      end

      page = (params[:page] || 0).to_i
      page_data = CapsuleService.new.list_paginated(page, 20)

      @capsules = page_data[:content]
      @total_pages = page_data[:totalPages]
      @total_elements = page_data[:totalElements]
      @current_page = page

      render "pages/admin"
    end

    # 管理员登录（表单提交）
    #
    # 验证通过后写入 Session，使用 Rails 默认的 Cookie-based Session；
    # Session 仅存储布尔标记，不存储密码或 token，安全性与 Laravel 实现一致。
    def admin_login
      password = params[:password].to_s
      token = AdminService.new.login(password)

      unless token
        @admin_error = "密码错误，请重试。"
        return render("pages/admin")
      end

      session[:admin_logged_in] = true
      redirect_to "/admin"
    end

    # 管理员退出登录（清除 Session 标记）
    def admin_logout
      session.delete(:admin_logged_in)
      redirect_to "/admin"
    end

    # 管理员删除胶囊（Session 保护）
    #
    # HTML 表单不支持 DELETE 方法，因此用 POST 路由 + Session 校验替代。
    def admin_delete
      unless session[:admin_logged_in]
        return redirect_to("/admin")
      end

      CapsuleService.new.delete(params[:code])
      page = (params[:page] || 0).to_i
      redirect_to "/admin?page=#{page}"
    end

    private

    # 构建技术栈图标列表，供首页和关于页渲染
    #
    # 静态资源放在 public/stack-logos/ 目录下（无资产管道，直接由 Rack 静态服务）。
    def tech_items
      [
        { src: "/stack-logos/rails.svg", alt: "Rails Logo", label: "Rails", version: Rails::VERSION::STRING },
        { src: "/stack-logos/ruby.svg", alt: "Ruby Logo", label: "Ruby", version: RUBY_VERSION },
        { src: "/stack-logos/erb.svg", alt: "ERB Logo", label: "ERB", version: "Templates" },
        { src: "/stack-logos/sqlite.svg", alt: "SQLite Logo", label: "SQLite", version: "3" },
      ]
    end
  end
end
