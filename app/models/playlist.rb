class Playlist < ActiveRecord::Base
  extend FriendlyId
  include Playlister::Social
  include Playlister::Video

  friendly_id :title, :use => :slugged
  delegate :username, :to => :user

  has_many :videos, :order => 'sort ASC'
  has_many :members, :through => :collaborators, :source => :user
  belongs_to :user

  scope :featured, where(:featured => true)
  scope :common, where(:featured => false)
  scope :published, where(:published => true)
  scope :drafts, where(:published => false)
  scope :recent, lambda {|n| order_by("created_at DESC").limit(n) }

  def update_thumb
    if !thumb && videos.count > 0
      tmp = Video.first(:conditions => {:playlist_id => self.id})
      update_attribute(:thumb, Youtube.get_thumbnail_url(tmp.ytid))
    end
  end
end