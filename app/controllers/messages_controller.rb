class MessagesController < ApplicationController
  def create
    @playlist = Playlist.find(params[:playlist_id])
    @message = @playlist.messages.create(params[:message].merge({:user_id => current_user.id}))
    respond_to do |format|
      format.js {}
    end
  end
end