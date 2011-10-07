class Admin::RecentVideosController < ApplicationController
  before_filter :admin_only!

  def index
    @recent_playlists= Playlist.published.order('created_at DESC')
  end

  private
    def admin_only!
      unless current_user && current_user.is_admin?
        flash[:notice] = "This area for admin only"
        redirect_to root_path
      end
    end
end