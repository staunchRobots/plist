class Playlist
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, :type=> String
  field :thumb, :type=> String
  field :old_videos, :type=> Array
  has_and_belongs_to_many :videos
  field :anonymous, :type => String
  field :hot, :type => Boolean
  field :published, :type => Boolean, :default => false
  field :featured, :type => Boolean, :default => false

  scope :featured, where(:featured => true)
  scope :published, where(:published => true)
  scope :hot, where(:hot => true)
  scope :recent, lambda {|n| order_by("created_at DESC").limit(n) }

  belongs_to :member

  after_create :make_me_hot

  def add_video(o)
    video= Video.first({:conditions => {:ytid => o[:ytid]}})
    unless (video)
      yt_feed= RestClient.get("http://gdata.youtube.com/feeds/api/videos/#{o[:ytid]}?v=2&alt=json")
      yt_video= JSON.parse(yt_feed)
      title= yt_video["entry"]["title"]["$t"]
      authors= [];
      yt_video["entry"]["author"].each do |a|
        author= {'name' => a["name"]["$t"], 'uri' => a["uri"]["$t"]}
        authors << author
      end
      video= Video.create({:ytid => o[:ytid], :title=>title, :author=>authors})
    end
    if !self.videos || self.videos.empty? || !self.thumb
      self.thumb= "http://img.youtube.com/vi/#{o[:ytid]}/2.jpg"
    end
    self.videos << video
    self.videos.uniq!
    self.save
  end

  def list_videos
    # playlist_videos= self.videos
    # list= Video.find(playlist_videos)
    # list= playlist_videos
    # @videos= []
    # playlist_videos.each do |pv|
    #   @videos << list.detect {|v| pv == v._id }
    # end
    # @videos.compact
    # @videos = list
    self.videos
  end

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
    if pos==0 || index==0
      self.thumb= "http://img.youtube.com/vi/#{Video.find(self.videos.first).ytid}/2.jpg"
    end
    self.save
  end

  private
  def make_me_hot
    if Playlist.hot.count < 20
      self.update_attributes(:hot => true)
    else
      current_playlist= Playlist.find({:hot=>true, :member_id=> self.member_id }) if self.member
      if current_playlist && current_playlist.count == 0
        current_playlist= Playlist.asc(:created_at).first
      end
      self.update_attributes(:hot => true)
      current_playlist.update_attributes(:hot => nil)
    end
  end
end
