class Video < ActiveRecord::Base
  # has_many :playlist_videos
  # has_many :playlists, :through => :playlist_videos
  belongs_to :playlist
  
  validates_presence_of :ytid
  
  before_create :parse_youtube
  
  private        
  
    def parse_youtube                                                      
      if ytid.match(/\?/) || ytid.match(/\&/)
        tmpid = ytid.gsub(/.*\?/, '').split('&').find{|r| r.match /v=.*/}
        self.ytid = tmpid[2..-1] if tmpid 
      end
      
      yt_feed= RestClient.get("http://gdata.youtube.com/feeds/api/videos/#{ytid}?v=2&alt=json")
      yt_video= JSON.parse(yt_feed)
      yt_title= yt_video["entry"]["title"]["$t"]
      self.title = yt_title
    end
end
