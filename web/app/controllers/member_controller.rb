class MemberController < ApplicationController
  # before_filter :valid_member?
  before_filter :is_member?, :only => [:index]
  skip_before_filter :require_user, :only => [:index]

  # GET /:member
  def index
    @member= Member.find(session[:member]) if session[:member]
    @editable= true
    @video_member= @member ? @member : nil
    if !@video_member || (params[:member] != @member.username)
      @video_member= Member.first(:conditions => {:username => params[:member]})
      @editable= false
    end

    if @video_member
      @playlists= @video_member.playlists
      @playlist= @playlists.first
      @videos= @playlist.list_videos
      @on= @playlists.first
      
      respond_to do |format|
        format.html { render "index/index" }
      end
    else
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
