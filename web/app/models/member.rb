class Member
  include Mongoid::Document
  include Mongoid::Timestamps
  
  has_many :playlists
  has_many :facebook_sessions

  field :username, :type => String
  field :name, :type=> String
  field :fb_uid, :type => String
end
