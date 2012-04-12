class YoutubeController < ApplicationController

  def search
    @playlist = Playlist.find(params[:plist])
    @is_pagination_search = params[:video][:page].nil?
    @videos = Youtube.ytsearch(params[:video][:search], current_user, {
      'start-index' => (params[:video][:page].to_i * 10)+1,
      :restriction  => request.remote_ip
      })
    respond_to do |format|
      format.js
    end
  end
  
end