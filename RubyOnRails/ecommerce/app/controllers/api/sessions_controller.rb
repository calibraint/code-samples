class Api::SessionsController < Devise::SessionsController
  skip_before_action :verify_signed_out_user, only: :destroy

  # Post api/users/sign_in
  def create
    begin
      if current_user
        render :status => :ok,
               :json => { :status => true, :data => current_user }
      else
        render :status => :not_acceptable,
               :json => { :status => false, :displayMessage => { :message => "Invalid User Name / Password" } }
      end
    rescue => exception
      render :status => :unprocessable_entity,
             :json => { :status => false, :displayMessage => exception }
    end
  end

  # Delete api/users/sign_out
  def destroy
    sign_out
    cookies.delete :ecommorce
    render :status => :ok,
           :json => { :status => true, :data => [] }
  end
end
