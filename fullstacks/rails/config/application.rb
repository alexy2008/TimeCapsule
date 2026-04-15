require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module HellotimeRails
  class Application < Rails::Application
    config.load_defaults 8.1

    config.autoload_lib(ignore: %w[assets tasks])

    # UTC timezone
    config.time_zone = "UTC"
    config.active_record.default_timezone = :utc

    # Session for web admin
    config.session_store :cookie_store, key: "_hellotime_session"

    # No system tests
    config.generators.system_tests = nil
  end
end
