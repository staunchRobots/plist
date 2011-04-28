# -*- coding: undecided -*-
class IndexController < ApplicationController
  def index
    @playlist= Playlist.all.first
    if !@playlist
      @playlist= Playlist.create!(:user_id=>1, :title=>"Homer's Super Playlist", :videos=>[])
    end
    session[:playlist]= @playlist
  end
end
