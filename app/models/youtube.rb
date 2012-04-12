class Youtube
  class << self
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

    def query_for_user_videos(phrase, user=nil, opts={})
      videos = search_youtube_videos(phrase, opts)
      videos = filter_user_videos(videos, user) if user
      videos
    end

    def search_youtube_videos(phrase, opts)
      phrase.gsub!(' ', '+')
      opts["alt"]         = 'json'
      opts["max-results"] = 10
      opts["format"] ||= 5


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

    def filter_user_videos(videos, user)
      videos = filter_plisted_videos(videos, user) if !user.show_plisted
      videos = filter_hated_videos(videos, user) if !user.show_filtered_videos
      videos
    end

    def filter_plisted_videos(videos, user)
      if !user.show_plisted
        plisted = user.videos.collect(&:ytid)
        videos.reject!{|v| plisted.include? v.ytid }
      end
      videos
    end

    def filter_hated_videos(videos, user)
      if !user.show_filtered_videos
        hates = user.hate_ytids
        videos.reject!{|v| hates.include? v.ytid }
      end
      videos
    end

    def get_properties(ytid)
      yt_feed= RestClient.get("http://gdata.youtube.com/feeds/api/videos/#{ytid}?v=2&alt=json")
      yt_video= JSON.parse(yt_feed)
      yt_title= yt_video["entry"]["title"]["$t"]
      {:title => yt_title}
    end

    def get_thumbnail_url(ytid)
      "http://img.youtube.com/vi/#{ytid}/2.jpg"
    end
  end


end
