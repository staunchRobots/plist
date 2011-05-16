# -*- coding: undecided -*-
class IndexController < ApplicationController
  before_filter :is_logged_in?
  skip_before_filter :require_user

  def index
    @editable= true
    if session[:fbsession]
      @member= Member.find(session[:member])
      if @member.username
        redirect_to "/#{@member.username}"
      else
        redirect_to "/#{@member.fb_uid}"
      end
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
      redirect_to "/home"
    end
  end

  private
  def is_logged_in?
    if (session[:member])
      @member= Member.find(session[:member])
      # redirect_to "/#{@member.username}"
    end
  end
end
