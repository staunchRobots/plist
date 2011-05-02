# -*- coding: undecided -*-
class IndexController < ApplicationController
  skip_before_filter :require_user

  def index
    if session[:fbsession]
      @member= Member.find(session[:member])
      redirect_to "/#{@member.fb_uid}"
    else
      session[:playlist]= false
      @playlists= Playlist.where(:anonymous => session[:session_id])
      if @playlists.empty?
        @playlists= [Playlist.create!(:user_id=>1, :title=>"My First Playlist", :videos=>[], :anonymous => session[:session_id])]
        session[:playlist]= true
      end
      @videos= @playlists.first.list_videos
      @playlist= @playlists.first
      @on= @playlist
    end
  end
end
