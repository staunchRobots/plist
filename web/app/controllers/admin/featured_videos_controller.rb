class Admin::FeaturedVideosController < ApplicationController
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
  
end