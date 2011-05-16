class HomeController < ApplicationController
  skip_before_filter :require_user

  def index
    @member= current_member if session[:member]
    @playlists= Playlist.where({:hot => true}).desc(:created_at)
  end
end
