class Video
  include Mongoid::Document
  include Mongoid::Timestamps

  field :ytid, :type=> String
  field :playlist_id, :type=>String
  field :title, :type=> String
  field :author, :type=>Array
end
