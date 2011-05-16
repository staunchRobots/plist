class HomeController < ApplicationController
  skip_before_filter :require_user

  def index
    @playlists= Playlist.where({:hot => true}).desc(:created_at)
  end
end
