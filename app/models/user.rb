class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_attached_file :avatar, :styles => { :medium => "100x100>", :thumb => "20x20>" }

  has_many :playlists, :include => [:user, :videos]
  has_many :jukeboxes
  has_many :videos, :through => :playlists
  has_many :user_hates

  has_many :onlines
  has_many :online_playlists, through: :onlines, class_name: 'playlist', foreign_key: 'playlist_id'


  validates_presence_of :username, :name
  validates_uniqueness_of :username

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me,
    :name, :username, :is_admin, :show_filtered_videos, :show_plisted,
    :avatar

  def to_param
    username
  end

  private

end
