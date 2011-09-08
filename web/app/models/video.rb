class Video
  include Mongoid::Document
  include Mongoid::Timestamps

  ## fields ##
  field :ytid, :type=> String # youtube_id(link)
  field :playlist_id, :type=>String
  field :title, :type=> String
  field :author, :type=>Array
  field :featured, :type => Boolean, :default => false

  ## named scopes ##
  scope :featured, where(:featured => true)
  scope :recent, lambda {|n| order_by("created_at DESC").limit(n) }

  ## methods ##
end
