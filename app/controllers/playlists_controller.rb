class PlaylistsController < InheritedResources::Base
  nested_belongs_to :user, :finder => :find_by_username

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
    playlist= Playlist.find(params[:id])
    pub = params[:published] ? true : false
    playlist.update_attribute(:published, pub)
    respond_to do |format|
      format.html {render :text => 'ok'}
    end
  end
end