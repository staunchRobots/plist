class User
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :username, :type => String
  field :name, :type=> String
  field :fb_uid, :type => String
end
