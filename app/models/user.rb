class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :playlists
  has_many :jukeboxes
  has_many :videos, :through => :playlists

  validates_presence_of :username, :name

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :name, :username, :is_admin

  after_create :create_first_playlist
  after_create :create_first_jukebox

  def to_param
    username
  end

  private

    def create_first_playlist
      self.playlists.create(:title => "My first playlist")
    end

    def create_first_jukebox
      self.jukeboxes.create(:title => "Room 1")
    end

end
