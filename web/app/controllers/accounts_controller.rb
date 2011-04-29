class AccountsController < ApplicationController
  # GET /accounts
  def index
  end

  # POST /login
  def login
    unless session[:fbsession]
      if params[:session]['session_key']
        fbsession= FacebookSession.create_session(params[:session])
        session[:fbsession]= fbsession
      end
    else
      unless session[:fbsession].session_key == params[:session]['session_key']
        FacebookSession.destroy_session(session[:fbsession].session_key)
        session[:fbsession]= nil
      end
    end

    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  # POST /logout
  def logout
    puts "logged out"
    puts params[:session].inspect
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end
end
