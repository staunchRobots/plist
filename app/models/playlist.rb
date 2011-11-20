class Playlist < ActiveRecord::Base
  # has_many :playlist_videos
  # has_many :videos, :through => :playlist_videos
  has_many :videos, :order => 'sort ASC'
  has_many :collaborators
  has_many :members, :through => :collaborators, :source => :user
  belongs_to :user

  scope :featured, where(:featured => true)
  scope :common, where(:featured => false)
  scope :published, where(:published => true)
  scope :drafts, where(:published => false)
  scope :hot, where(:hot => true)
  scope :recent, lambda {|n| order_by("created_at DESC").limit(n) }

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

  def update_thumb
    if !thumb && videos.count > 0
      tmp = Video.first(:conditions => {:playlist_id => self.id})
      update_attribute(:thumb, Youtube.get_thumbnail_url(tmp.ytid))
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

  def has_member?(user)
    members.include? user
  end

end
