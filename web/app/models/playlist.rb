class Playlist
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :member_id, :type => String
  field :title, :type=> String
  field :videos, :type=> Array

  belongs_to :member

  def remove_video(id)
    video= Video.find(id)
    self.videos.delete(video._id)
    self.save
    video.destroy
  end

  def sort(video_id, pos)
    video= Video.find(video_id)
    index= self.videos.index(video._id)
    el= self.videos.delete_at index
    self.videos.insert(pos.to_i, el)
    self.save
  end
end
