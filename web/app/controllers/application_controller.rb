class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :require_user
  before_filter :show_session

  private
  def show_session
    puts "show_session:"+session.inspect+"-"+controller_name
  end

  def require_user
    # should test for session expiration
    puts "SESSION:"+session.inspect+"-"+controller_name
    if !session
      respond_to do |format|
        format.html {render :text => "fail"}
      end
    else
      puts "fbsession: "+session[:fbsession]
      if !session[:fbsession]
        puts "no llega aqui"
        respond_to do |format|
          format.html {render :text => "fail"}
        end
      end
    end
  end
end
