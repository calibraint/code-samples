Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    resources :category
    resources :product
    resources :customer
    # resources :product
  end

  devise_for :users,
             defaults: { format: :json },
             class_name: "User",
             controllers: {
               sessions: "api/sessions",
               registrations: "api/registrations",
               confirmations: "api/confirmations",
               passwords: "api/passwords",
             },
             path_prefix: "/api"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
