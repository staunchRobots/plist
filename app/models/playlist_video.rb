class PlaylistVideo < ActiveRecord::Base
  belongs_to :playlist
  belongs_to :video
  default_scope :order => 'order ASC'
end
