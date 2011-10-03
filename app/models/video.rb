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

    def ytsearch(phrase = '', user = nil, opts={})
      result = query_for_user_videos(phrase, user, opts)
      opts["start-index"] ||= 0
      while result.length < 10
         opts["start-index"] += 1
         result.concat(query_for_user_videos(phrase, user, opts))
         result.uniq!(&:ytid)
      end
      result[0..9]
    end

    def query_for_user_videos(phrase, user, opts={})
      videos = query_youtube_videos(phrase, opts)
      filter_hated_videos(videos, user)
    end

    def query_youtube_videos(phrase = '', opts)
      phrase.gsub!(' ', '+')
      opts[:alt] = 'json'
      opts["max-results"] = 10

      req_url = "http://gdata.youtube.com/feeds/api/videos?q=#{phrase}"
      req_url += '&' + opts.collect{|k,v| "#{k}=#{v}"}.join('&')
      Rails.logger.info "Youtube request: #{req_url}"

      yt_feed= RestClient.get(req_url)
      yt_video= JSON.parse(yt_feed)

      yt_video["feed"]["entry"].collect {|entry|
        ytid = Playlist.new.extract_ytid(entry["link"].first["href"])
        title = entry["title"]["$t"]
        Video.new(:ytid => ytid, :title => title)
      }
    end

    def filter_hated_videos(videos, user)
      hates = user.hate_ytids
      videos.reject{|v| hates.include? v.ytid }
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
