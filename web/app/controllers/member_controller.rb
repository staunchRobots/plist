class MemberController < ApplicationController
  # before_filter :valid_member?
  before_filter :is_member?, :only => [:index]
  skip_before_filter :require_user, :only => [:index]

  # GET /:member
  def index
    @member= current_member if session[:member]
    @editable= true
    @playlist_member= @member ? @member : nil
    if !@playlist_member || (params[:member] != @member.username)
      @playlist_member= Member.first(:conditions => {:username => params[:member]})
      @editable= false
    end

    if @playlist_member
      if @playlist_member == @member
        @playlists= @playlist_member.playlists
        if @playlists.count == 0
          @playlist_member.playlists << Playlist.create({:title=>"My First Playlist", :videos=>[]})
        end
      else
        @playlists= @playlist_member.playlists.published
      end


      @playlist= @playlists.first
      @videos= @playlist.list_videos
      @on= @playlists.first
      
      respond_to do |format|
        format.html { render "index/index" }
      end
    else
      puts "here????"
      if @member
        redirect_to "/#{@member.username}"
      else
        redirect_to "/"
      end
    end
  end

  private
  def valid_member?
    @member= Member.find(session[:member])
    unless @member.fb_uid == params[:member]
      respond_to do |format|
        format.html { render :text => "i don't know who thou art!" }
      end
    end
  end

  def is_member?
    if session[:member]
      @member= Member.find(session[:member])
      unless @member.username
        respond_to do |format|
          format.html { render "accounts/signup", :layout => false }
        end
      end
    end
  end
end
