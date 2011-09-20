class RemoteController < ApplicationController
  def index
    @plays = PlaySession.all
  end       
  
  def show          
    if session[:remote_session]
      @play = PlaySession.find(session[:remote_session])
    else
      flash[:notice] = "Couldn't connect to session"
      redirect_to :index
    end
  end
  
  def connect
    @play = PlaySession.find(params[:id])
    @play.require_pin
  end       
  
  def connect_now
    @play = PlaySession.find(params[:id])
    if params[:pin] == @play.pin.to_s
      session[:remote_session] = @play.id
      redirect_to remote_path @play
    else             
      flash[:notice] = "wrong PIN!"
      render :connect
    end
  end     
                    
  
  def next
    if session[:remote_session]
      @play = PlaySession.find(params[:id])
      @play.next
    end    
  end
  
  def prev
    if session[:remote_session]
      @play = PlaySession.find(params[:id])
      @play.prev
    end    
  end
  
  def switch
    if session[:remote_session]
      @play = PlaySession.find(session[:remote_session])
      @play.switch(params[:video][:video_id])
      redirect_to remote_path(@play)
    else
      flash[:notice] = "Couldn't connect to session"
      redirect_to :index
    end
  end
  
  
  def check_out
    play = PlaySession.find(params[:id])
    if play.inquire_pin
      play.inquire_pin = false
      play.save
      
      render :update do |page|
        page.alert "PIN is:" + play.pin.to_s
      end
    elsif play.updated
      play.updated = false
      play.save                        
      render :update do |page|      
        path = "/#{play.playlist.member.username}/#{play.playlist.id}?video=#{play.current_video.id}"
        page << "window.location = '#{path}'"
      end
    else
      render :nothing => true
    end
  end
  
  
end