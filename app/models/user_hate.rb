class UserHate < ActiveRecord::Base
  belongs_to :user
  validates_uniqueness_of :ytid, :scope => :user_id
end
