class Admin::FeaturedVideosController < ApplicationController
  def index
    @featured = Video.featured
    @videos = Video.recent(10)
  end
  
  def update
    if params[:featured] && params[:featured][:ids]
      params[:featured][:ids].compact!
      params[:featured][:ids].reject!(&:blank?)
      
      @featured = Video.featured
      @featured.each{|video|
        video.update_attribute(:featured, false) unless params[:featured][:ids].include? video._id.to_s
      }
    
      Video.find(params[:featured][:ids]).each{|video|
        video.update_attribute(:featured, true)
      }
    end
    redirect_to admin_featured_path
  end
  
end