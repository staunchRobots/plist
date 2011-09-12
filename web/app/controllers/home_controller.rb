class HomeController < ApplicationController
  skip_before_filter :require_user

  def index
    @member= current_member if session[:member]
    @playlists= Playlist.published.hot.desc(:created_at)
    @featured = Video.featured
  end
end
