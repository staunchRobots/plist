class PlaylistsController < ApplicationController
  before_filter :valid_member?, :only => [:create]
  skip_before_filter :require_user, :only => [:index, :show]

  # GET /:member/playlists
  def index
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
    @member= Member.find(session[:member]).first if session[:member]
    @editable= true
    @video_member= @member ? @member : nil
    if !@video_member || (params[:member] != @member.fb_uid)
      @video_member= Member.first(:conditions => {:fb_uid => params[:member]})
      @editable= false
    end

    @playlists= @video_member.playlists
    @playlist= Playlist.find(params[:playlist])
    @on= @playlist
    @videos= @playlist.list_videos
    respond_to do |format|
      format.html { render "index/index" }
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
