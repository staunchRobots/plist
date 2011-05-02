class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :require_user

  private
  def require_user
    # should test for session expiration
    if !session
      respond_to do |format|
        format.html {render :text => "fail"}
      end
    else
      if !session[:fbsession]
        respond_to do |format|
          format.html {render :text => "fail"}
        end
      end
    end
  end
end
