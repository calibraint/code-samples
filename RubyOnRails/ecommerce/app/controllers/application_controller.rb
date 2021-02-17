class ApplicationController < ActionController::API
  include ::ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include ActionController::MimeResponds
  include JSONAPI::ActsAsResourceController
  before_action :authenticate_user!
  respond_to :json
end
