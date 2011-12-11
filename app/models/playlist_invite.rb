class PlaylistInvite < ActiveRecord::Base
  belongs_to :playlist
  belongs_to :user
  include ActionView::Helpers

  scope :for_user, -> user_id { includes(:playlist).where(user_id: user_id) }
  scope :user_invited_to, -> user_id, playlist_id { joins(:playlist).where(user_id: user_id, playlist_id: playlist_id) }

  def after_create
    UserMailer.collaboration_invite(self).deliver
  end

  def url
    link_to 'Accept invintation', Rails.application.routes.url_helpers.accept_invites_url(:token => invite_token, :host => 'dev.plist.tv')
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
end
