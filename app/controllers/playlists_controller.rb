class PlaylistsController < InheritedResources::Base
  nested_belongs_to :user, :finder => :find_by_username
  respond_to :js, :html

  def show
    show! do |format|
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

end