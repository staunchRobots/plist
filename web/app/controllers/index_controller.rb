# -*- coding: undecided -*-
class IndexController < ApplicationController
  skip_before_filter :require_user

  def index
    @playlists= []
    if !session[:playlist]
      @playlist= Playlist.create!(:user_id=>1, :title=>"Homer's Super Playlist", :videos=>[])
      session[:playlist]= @playlist
    end
  end
end
