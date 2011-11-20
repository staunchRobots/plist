class InvitesController < ApplicationController 
  def create     
    @errors = []
    playlist_id, username = params[:playlist_id], params[:username]
    if playlist_id.nil? || username.nil?
      @errors << "ID and Username must present"
    else
      if !Playlist.exists?(playlist_id) || !User.exists?(:username => username)
        @errors << "User or Playlist not found"
      else
        @playlist = Playlist.find(playlist_id)
        @user = User.find_by_username(username)
        unless @playlist.members.collect(&:id).include?(@user.id) || PlistInvite.exists?(:playlist_id => playlist_id, :user_id => @user.id)
          @invite = PlistInvite.create(:playlist_id => playlist_id, 
            :user_id => @user.id, 
            :invite_token => BCrypt::Engine.generate_salt)
        else 
          @errors << "Already invited"
        end
      end
      respond_to do |format|
        format.js
      end
    end
    
  end
  
  def accept
    if params[:token]
      @invite = PlistInvite.find_by_invite_token(params[:token])
      if @invite
        @invite.accept(current_user)
        if @invite.valid?
          redirect_to @invite.playlist, :notice => 'You can collaborate now on this project'
        else
          redirect_to '/', :notice => 'Error occured while accepting invite'
        end
      else
        redirect_to '/', :notice => 'Error occured while accepting invite'
      end
    end
  end
  
end