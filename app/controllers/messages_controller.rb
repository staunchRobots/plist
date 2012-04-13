class MessagesController < ApplicationController
  def create
    @playlist = Playlist.find(params[:playlist_id])

    respond_to do |format|
      if !params[:message][:text].empty?
        @message = @playlist.messages.create(params[:message].merge({:user_id => current_user.id}))
        format.js {}
      else
        format.js { render :nothing => true }
      end
    end
  end
end