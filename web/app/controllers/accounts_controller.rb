class AccountsController < ApplicationController
  skip_before_filter :require_user, :only => [:login]

  # GET /accounts
  def index
  end

  # POST /login
  def login
    unless session[:fbsession]
      if params[:session]['session_key']
        fbsession= (FacebookSession.create_session(params[:session]))
        session[:fbsession]= fbsession[:fbsession]
        session[:member]= fbsession[:member]
        member= Member.find(session[:member])
        
        if member.playlists.empty?
          playlists= Playlist.where({:anonymous => session[:session_id]})
          member.playlists= playlists
          member.save
        end        
      end
    else
      unless session[:fbsession][:session_key] == params[:session]['session_key']
        FacebookSession.destroy_session(session[:fbsession][:session_key])
        # should generate new session || redirect to GET '/session'
        session= {}
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
    reset_session
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end
end
