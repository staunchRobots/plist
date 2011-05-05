class PlaylistsController < ApplicationController
  before_filter :valid_member?, :only => [:create]
  skip_before_filter :require_user, :only => [:index, :show]

  # GET /:member/playlists
  def index
    @editable= true
    @member= Member.find(session[:member])

    @playlists= @member.playlists
    @on= @playlists.first

    respond_to do |format|
      format.html { render :partial => "playlists/list" }
    end
  end

  def create
    member= Member.find(session[:member])
    member.playlists << Playlist.new({:title=>params[:playlist]['title'], :videos => []})
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  def show
    @member= Member.find(session[:member]) if session[:member]
    @editable= true
    @playlist_member= @member ? @member : nil
    if !@playlist_member || (params[:member] != @member.username)
      @playlist_member= Member.first(:conditions => {:username => params[:member]})
      @editable= false
    end

    if @playlist_member
      @playlists= @playlist_member.playlists
      @playlist= Playlist.find(params[:playlist])
      @videos= @playlist.list_videos
      @on= @playlist
      
      respond_to do |format|
        format.html { render "index/index" }
      end
    else
      if @member
        redirect_to "/#{@member.username}"
      else
        redirect_to "/"
      end
    end
  end

  private
  def valid_member?
    @member= Member.find(session[:member])
    unless @member.fb_uid == params[:member]
      respond_to do |format|
        format.html { render :text => "i don't know who thou art!" }
      end
    end
  end
end
