class MemberController < ApplicationController
  before_filter :valid_member?

  # GET /:member
  def index
    @playlists= @member.playlists
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
