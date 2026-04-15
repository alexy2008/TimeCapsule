ENV["RAILS_ENV"] = "test"
require_relative "../config/environment"

# 测试环境使用 :memory: SQLite，不依赖共享的 hellotime.db。
#
# 为什么不用 rails/test_help：
#   标准的 rails/test_help 会调用 maintain_test_schema!，该方法检查
#   schema_migrations 表来判断是否有待执行的 migration。而共享的
#   hellotime.db 不通过 Rails 管理，没有 schema_migrations 表，
#   会导致测试启动失败。解决方案：
#     1. config/environments/test.rb 设置 maintain_test_schema = false
#     2. 此处手动 define schema，在每次测试前重建内存数据库结构
#
# 这与 Spring MVC 的测试在 application-test.properties 中配置
# H2 内存数据库的思路完全一致。
ActiveRecord::Schema.define do
  create_table :capsules, id: false, force: true do |t|
    t.string :code, limit: 8, null: false
    t.string :title, limit: 200, null: false
    t.text :content, null: false
    t.string :creator, limit: 100, null: false
    t.datetime :open_at, null: false
    t.datetime :created_at, null: false
  end
  add_index :capsules, :code, unique: true
end

require "action_dispatch/testing/integration"
require "minitest/autorun"

class ActiveSupport::TestCase
end
