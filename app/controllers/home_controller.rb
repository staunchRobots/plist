class HomeController < ApplicationController
  def index
    @featured_playlists = Playlist.featured
  end
end