class PlaylistController < ApplicationController
  skip_before_filter :require_user

  # GET /playlist
  # Only for anonymous sessions, that is, not FB connected
  def index
    @editable= true
    @playlists= Playlist.where(:anonymous => session[:session_id])
    @on= @playlists.first
    respond_to do |format|
      format.html { render :partial => "playlists/list" }
    end
  end

  # GET /:user/:playlist
  def show
    playlist_videos= playlist.videos
    videos= Video.find(playlist_videos)
    @videos= []

    @member= Member.find(session[:member]) if session[:member]
    if @member
      if @member.fb_uid == params[:user]
        @editable= true
      end
    end

    playlist_videos.each do |pv|
      @videos << videos.detect {|v| pv == v._id }
    end

    respond_to do |format|
      format.html { render :partial => "index/playlist" }
    end
  end

  def create
    playlist= Playlist.create({:title => params[:playlist][:title], :anonymous => session[:session_id], :videos => []})
    respond_to do |format|
      format.html { render :text => "ok"}
    end
  end

  def get_videos
    playlist= Playlist.find(params[:playlist])
    @member= Member.find(session[:member]) if session[:member]
    if @member
      if @member == playlist.member
        @editable= true
      end
    end
    if playlist.member.nil?
      @editable= true
    end
    if params[:edit]=='true'
      @editing= true;
    end

    @videos= playlist.list_videos
    respond_to do |format|
      format.html { render :partial => "index/playlist" }
    end
  end

  def post_video
    playlist= Playlist.find(params[:playlist])
    playlist.add_video({:ytid => params[:v]})

    respond_to do |format|
      format.html { render :text => "ok"}
    end
  end

  def delete_video
    playlist= Playlist.find(params[:playlist])
    playlist.remove_video(params[:id])
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  def destroy
    playlist= Playlist.find(params[:id])
    playlist.destroy
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  def sort
    playlist= Playlist.find(params[:playlist])
    if params[:video]
      if params[:pos]
        sort= playlist.sort(params[:video], params[:pos].to_i)
      end
    else
    end
    respond_to do |format|
      format.html {render :text=>sort}
    end
  end

  def update
    playlist= Playlist.find(params[:playlist])
    playlist.update_attribute(:published, params[:published]) if params[:published]
    respond_to do |format|
      format.html {render :text => 'ok'}
    end
  end
end
