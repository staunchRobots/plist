class RemotePlaylistController < ActionController::Metal
  include ActionController::Rendering
  
  def check_out
    play = PlaySession.find(params[:id])
    headers['Content-Type'] = 'text/javascript; charset=utf-8'
    if play.inquire_pin
      play.inquire_pin = false
      play.save      
      render :text => "alert('PIN is:#{play.pin}')"
    elsif play.updated
      play.updated = false
      play.save                        
      render :text => "$('#player-e').get(0).loadVideoById('#{play.current_video.ytid}');"
    else
      ''
    end
  end

end