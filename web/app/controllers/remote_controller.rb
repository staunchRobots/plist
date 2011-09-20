class RemoteController < ApplicationController
  skip_before_filter :require_user
  
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
end