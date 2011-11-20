class PlistInvite < ActiveRecord::Base
  belongs_to :playlist
  belongs_to :user
  include ActionView::Helpers
  
  def after_create
    UserMailer.collaboration_invite(self).deliver
  end
  
  def url
    link_to 'Accept invintation', Rails.application.routes.url_helpers.accept_invites_url(:token => invite_token, :host => 'dev.plist.it')
  end
  
  def accept(current_user)
    if !playlist.has_member? user
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
