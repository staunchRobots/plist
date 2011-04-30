class AccountsController < ApplicationController
  skip_before_filter :require_user, :only => [:login]

  # GET /accounts
  def index
  end

  # POST /login
  def login
    unless session[:fbsession]
      if params[:session]['session_key']
        session.merge!(FacebookSession.create_session(params[:session]))
      end
    else
      unless session[:fbsession].session_key == params[:session]['session_key']
        FacebookSession.destroy_session(session[:fbsession].session_key)
        # should generate new session || redirect to GET '/session'
        session= nil
      end
    end

    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  # POST /logout
  def logout
    FacebookSession.destroy_session(session[:fbsession]['session_key'])
    # should generate new session || redirect to GET '/session'
    session= nil
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end
end
