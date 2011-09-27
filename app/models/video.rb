class Video < ActiveRecord::Base
  # has_many :playlist_videos
  # has_many :playlists, :through => :playlist_videos
  belongs_to :playlist

  validates_presence_of :ytid

  before_create :parse_youtube

  class << self
    def top_rated
      yt_feed= RestClient.get("https://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?alt=json")
      yt_video= JSON.parse(yt_feed)
      yt_video["feed"]["entry"].collect {|entry|
        ytid = Playlist.new.extract_ytid(entry["link"].first["href"])
        title = entry["title"]["$t"]
        Video.new(:ytid => ytid, :title => title)
      }
    end

    def ytsearch(phrase = '', opts={})
      phrase.gsub!(' ', '+')
      opts[:alt] = 'json'
      opts["max-results"] = 10
      req_url = "http://gdata.youtube.com/feeds/api/videos?q=#{phrase}"
      req_url += '&' + opts.collect{|k,v| "#{k}=#{v}"}.join('&')

      yt_feed= RestClient.get(req_url)
      yt_video= JSON.parse(yt_feed)
      yt_video["feed"]["entry"].collect {|entry|
        ytid = Playlist.new.extract_ytid(entry["link"].first["href"])
        title = entry["title"]["$t"]
        Video.new(:ytid => ytid, :title => title)
      }
    end
  end
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
