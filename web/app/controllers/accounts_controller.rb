class AccountsController < ApplicationController
  skip_before_filter :require_user, :only => [:login]

  # GET /accounts
  def index
  end

  # GET /accounts/username
  def username
    @member= Member.find(session[:member])
    update= @member.update_username(params[:member][:username])
    if (update)
      respond_to do |format|
        format.html { render :text => 'ok' }
      end
    else
      respond_to do |format|
        format.json { render :json => update[:error] }
      end
    end
  end

  # POST /signup
  def post_signup
    @member= Member.find(session[:member])
    @member.signup(params[:member])
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  # POST /login
  def login
    unless session[:fbsession]
      if params[:session]['session_key']
        fbsession= (FacebookSession.create_session(params[:session]))
        session[:fbsession]= fbsession[:fbsession]
        session[:member]= fbsession[:member]
        @member= Member.find(session[:member])
        
        if @member.playlists.empty?
          playlists= Playlist.where({:anonymous => session[:session_id]})
          @member.playlists= playlists
          @member.save
        end        
      end
    else
      @member= Member.find(session[:member])
      unless session[:fbsession][:session_key] == params[:session]['session_key']
        FacebookSession.destroy_session(session[:fbsession][:session_key])
        # should generate new session || redirect to GET '/session'
        session= {}
      end
    end

    if !@member.username
      respond_to do |format|
        format.json { render :json => {:signup => true} }
      end
    else
      respond_to do |format|
        format.html { render :text => "ok" }
      end
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
