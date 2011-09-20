class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :require_user
  before_filter :load_members_lists
  before_filter :fetch_play_session
  helper_method :current_member

  protected
  def current_member
    Member.find(session[:member])
  end

  private
  def require_user
    # should test for session expiration
    if !session
      respond_to do |format|
        format.html {render :text => "fail"}
      end
    else
      if !session[:fbsession]
        respond_to do |format|
          format.html {render :text => "fail"}
        end
      end
    end
  end
  
  def load_members_lists
    @special_members = Playlist.featured.collect(&:member).compact.uniq
    @common_members = Playlist.common.collect(&:member).compact.uniq
  end
  
  def fetch_play_session    
    if session[:member]
      if params[:playlist]
        @play = PlaySession.find_or_create_by(:member => current_member.username)
        @play.playlist =  params[:playlist]
        @play.save
      else
        @play = PlaySession.first(:conditions => {:member => current_member.username})
      end                 
      @play.current_video = if params[:video] 
          params[:video]
        else
          if @play && @play.playlist
            @play.playlist.videos.try(:first).try(:id)
          else
            nil
          end
       end
    end
  end
  
  
end
