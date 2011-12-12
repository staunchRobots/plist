class PlaylistInvite < ActiveRecord::Base
  belongs_to :playlist
  belongs_to :user
  include ActionView::Helpers

  scope :for_user, -> user_id { includes(:playlist).where(user_id: user_id) }
  scope :user_invited_to, -> user_id, playlist_id { joins(:playlist).where(user_id: user_id, playlist_id: playlist_id) }
  scope :user, where(invite_type: 'user')

  def after_create
    UserMailer.collaboration_invite(self).deliver if user_id
  end

  def url
    if invite_type == 'user'
      routes.accept_invites_url(:token => invite_token)
    elsif invite_type
      routes.user_playlist_url(self.playlist.user.username, self.playlist, access_token: invite_token)
    end
  end

  def link
    Rails.application.routes.url_helpers.accept_invites_url(:token => invite_token)
  end

  def accept(current_user)
    if playlist.has_member? user
      errors.add(:user, 'User is already a member of playlist')
      return
    end
    unless user.id == current_user.id
      errors.add(:user, 'User is already a member of playlist')
      return
    end
    playlist.members << user
    playlist.save
    self.delete
    self
  end

  def routes
    Rails.application.routes.url_helpers
  end

end
