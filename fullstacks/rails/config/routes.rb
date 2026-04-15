Rails.application.routes.draw do
  # Web routes
  root to: "web/pages#home"
  get  "create",  to: "web/pages#create_form"
  post "create",  to: "web/pages#create_submit"
  get  "open",    to: "web/pages#open_form"
  get  "open/search", to: "web/pages#open_search"
  get  "open/:code",  to: "web/pages#open_by_code"
  get  "about",   to: "web/pages#about"
  get  "admin",   to: "web/pages#admin"
  post "admin/login",  to: "web/pages#admin_login"
  post "admin/logout", to: "web/pages#admin_logout"
  post "admin/capsules/:code/delete", to: "web/pages#admin_delete"

  # API routes
  namespace :api do
    namespace :v1 do
      get  "health",                  to: "health#show"
      post "capsules",                to: "capsules#create"
      get  "capsules/:code",          to: "capsules#show"
      post "admin/login",             to: "admin#login"
      get  "admin/capsules",          to: "admin#index"
      delete "admin/capsules/:code",  to: "admin#destroy"
    end
  end
end
