class HomeController < ApplicationController
  def index
    @recent_playlists= Playlist.published.order('created_at DESC')
    @featured_playlists = Playlist.featured
  end
end