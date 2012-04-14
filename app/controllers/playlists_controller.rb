class PlaylistsController < InheritedResources::Base
  nested_belongs_to :user, :finder => :find_by_username
  respond_to :js, :html

  rescue_from ActiveRecord::RecordNotFound do
    redirect_to "/", notice: 'Playlist was not found'
  end

  def show
    show! do |format|
      init_onlines
      @onlines = @playlist.onlines.reload
      @link_invite_everyone = @playlist.link_invite
      @link_invite_plisters = @playlist.link_invite('plisters')
      @access_token = params[:access_token]
      format.html {
        unless @playlist.published
          if !user_signed_in? || !has_access_to(current_user, @playlist)
            flash[:error] = 'This is private playlist'
            redirect_to root_path
          end
        end
      }
    end
  end

  def published
    @playlist = Playlist.find(params[:id])
    pub = params[:playlist_published] ? true : false
    @playlist.update_attribute(:published, pub)
    respond_to do |format|
      format.html {render :text => 'ok'}
      format.js
    end
  end

  def destroy
    super do |format|
     flash[:notice] = "Playlist deleted"
     format.html { redirect_to root_url }
     format.js
    end
  end

  def create
    super do |format|
     flash[:notice] = "Playlist created"
     format.html { redirect_to [current_user,@playlist] }
     format.js
    end

  end

  def watch
    show! do |format|
      init_onlines
      @onlines = @playlist.onlines.reload
      @access_token = params[:access_token]
      format.html {
        if !user_signed_in? || current_user != @playlist.user
          unless @playlist.published
            flash[:error] = 'This is private playlist'
            redirect_to root_path
          end
        end
      }
    end
  end

  def play
    @playlist = params[:id]
    @video = params[:video]
    respond_to do |format|
      format.js
    end
  end

  def shared
    @user = User.find_by_username(params[:user_id])
    @shared_with_me = Playlist.shared_with(@user.id)
    @shared_by_me   = Playlist.shared_by(@user.id)
    @invited_me = PlaylistInvite.for_user(@user.id)
  end

  def bye
    @playlist = Playlist.find(params[:playlist_id])
    @online = @playlist.onlines.where(:user_id => params[:user_id]).first
    if @online
      @online.destroy
    end
    @onlines = @playlist.onlines.reload
    respond_to do |format|
      format.js
    end
  end

  private

  def init_onlines
    @playlist.onlines.build(user_id: current_user.id).save if current_user
  end

end
