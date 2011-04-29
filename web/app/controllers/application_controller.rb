class ApplicationController < ActionController::Base
  protect_from_forgery

  def require_user
    # should test for session expiration
    unless session[:fbsession]
      respond_to do |format|
        format.html {render :text => "fail"}
      end
    end
  end
end
