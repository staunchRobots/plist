class PlaySession
  include Mongoid::Document
  include Mongoid::Timestamps

  ## fields ##
  belongs_to :playlist
  belongs_to :current_video, :class_name => "Video"
  field :updated, :type => Boolean, :default => false
  field :member
  field :pin
  field :inquire_pin, :type => Boolean, :default => false
  

  def require_pin
    self.pin = rand(100000)
    self.inquire_pin = true
    self.save
  end
  
  def next         
    
  end
  
  def prev
  end
  
  def switch(video_id)
    self.current_video = video_id
    self.updated = true
    self.save
  end

end