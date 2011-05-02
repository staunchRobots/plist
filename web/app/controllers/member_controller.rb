class MemberController < ApplicationController
  # before_filter :valid_member?
  skip_before_filter :require_user, :only => [:index]

  # GET /:member
  def index
    @member= Member.find(session[:member]) if session[:member]
    @editable= true
    @video_member= @member ? @member : nil
    if !@video_member || (params[:member] != @member.fb_uid)
      @video_member= Member.first(:conditions => {:fb_uid => params[:member]})
      @editable= false
    end

    @playlists= @video_member.playlists
    @playlist= @playlists.first
    @videos= @playlist.list_videos
    @on= @playlists.first

    respond_to do |format|
      format.html { render "index/index" }
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
end
