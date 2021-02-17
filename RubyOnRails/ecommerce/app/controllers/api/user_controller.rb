class Api::UserController < ApplicationController


private 
# Only allow a trusted parameter "white list" through.
def user_params
    params.require(:user).permit(:email)
end

end
