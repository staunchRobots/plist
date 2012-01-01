class HomeController < ApplicationController
  def index
    @featured_playlists = Playlist.includes(:user).featured
  end
end
