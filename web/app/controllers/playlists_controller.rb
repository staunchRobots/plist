class PlaylistsController < ApplicationController
  # GET /:member
  def index
#    @playlists= session[:member].playlists
    respond_to do |format|
      # format.html { render :partial => "playlist/list" }
      format.html { render :text => "playlist/list" }
    end
  end

  def create
    # Playlist.create({:title=>params[:playlist]['title']})
    respond_to do |format|
      format.html { render :text => params[:playlist]['title'] }
    end
  end
end
