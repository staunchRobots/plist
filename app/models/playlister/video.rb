module Playlister::Video
  include ActiveSupport::Concern

  def add_video(yt_url, is_url = true)
    ytid = is_url ? extract_ytid(yt_url) : yt_url
    unless videos.collect(&:ytid).include? ytid
      v = videos.create(:ytid => ytid)
      update_thumb if videos.count == 1
      v
    else
      nil
    end
  end

  def extract_ytid(yt_url)
    tmpid = yt_url.gsub(/.*\?/, '').split('&').find{|r| r.match /v=.*/}
    tmpid[2..-1]
  end

  def update_videos_sort_order(params)
    order = ids_to_sorting_hash(params)
    videos.where(:id => order.keys).each do |video|
      video.update_attribute(:sort, order[video.id])
      video.save
    end
  end

  def ids_to_sorting_hash(ids)
    index = 0
    ids.collect{|value| index += 1; {value.to_i => index};}.reduce(&:merge)
  end

end