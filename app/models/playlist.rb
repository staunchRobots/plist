class Playlist < ActiveRecord::Base
  extend FriendlyId
  friendly_id :title, :use => :slugged
  delegate :username, :to => :user

  # has_many :playlist_videos
  # has_many :videos, :through => :playlist_videos
  has_many :videos, :order => 'sort ASC'
  has_many :collaborators, dependent: :destroy
  has_many :members, :through => :collaborators, :source => :user
  belongs_to :user
  has_many :playlist_invites, dependent: :destroy

  scope :featured, where(:featured => true)
  scope :common, where(:featured => false)
  scope :published, where(:published => true)
  scope :drafts, where(:published => false)
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

  def accessible_by(user)
    self.user == user || self.has_member?(user)
  end

  def accessible_via(access_token)
    link_invite && (link_invite.invite_token == access_token || link_invite('plisters').invite_token == access_token)
  end

  def invited_members
    invited_ids = PlaylistInvite.where(:playlist_id => self.id).collect(&:user_id).uniq
    User.where(:id => invited_ids)
  end

  def invite_for(user_id)
    PlaylistInvite.user_invited_to(user_id, self.id).first
  end

  def link_invite(type = 'everyone')
    PlaylistInvite.where(invite_type: "link_#{type}", playlist_id: self.id).first
  end

  class << self
    def shared_with(user_id)
      shared_ids = Collaborator.where(:user_id => user_id).collect(&:playlist_id).uniq
      Playlist.where(:id => shared_ids)
    end

    def shared_by(user_id)
      shared_ids = Collaborator.includes(:playlist).where(:playlists => {:user_id => user_id}).collect(&:playlist_id).uniq
      Playlist.where(:id => shared_ids)
    end
  end

end
