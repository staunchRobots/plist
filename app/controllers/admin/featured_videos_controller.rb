class Admin::FeaturedVideosController < ApplicationController
  before_filter :admin_only!

  def index
    @featured = Playlist.featured
    @playlists = Playlist.all
  end

  def update
    if params[:featured] && params[:featured][:ids]
      params[:featured][:ids].compact!
      params[:featured][:ids].reject!(&:blank?)

      @featured = Playlist.featured
      @featured.each{|pl|
        pl.update_attribute(:featured, false) unless params[:featured][:ids].include? pl._id.to_s
      }

      Playlist.find(params[:featured][:ids]).each{|pl|
        pl.update_attribute(:featured, true)
      }
    end
    redirect_to admin_featured_path
  end

  private
    def admin_only!
      unless current_user && current_user.is_admin?
        flash[:notice] = "This area for admin only"
        redirect_to root_path
      end
    end

end