module Playlister::Social
  extend ActiveSupport::Concern

  included do
    has_many :collaborators, dependent: :destroy
    has_many :playlist_invites, dependent: :destroy
  end

  module ClassMethods
    def shared_with(user_id)
      shared_ids = Collaborator.where(:user_id => user_id).collect(&:playlist_id).uniq
      Playlist.where(:id => shared_ids)
    end

    def shared_by(user_id)
      shared_ids = Collaborator.includes(:playlist).where(:playlists => {:user_id => user_id}).collect(&:playlist_id).uniq
      Playlist.where(:id => shared_ids)
    end
  end

  def has_member?(user)
    members.include? user
  end

  def accessible_by(user)
    self.user == user || self.has_member?(user)
  end

  def accessible_via(access_token)
    link_invite && (link_invite.invite_token == access_token || link_invite('plisters').invite_token == access_token)
  end

  def invited_members
    invited_ids = PlaylistInvite.where(:playlist_id => self.id).collect(&:user_id).uniq
    User.where(:id => invited_ids)
  end

  def invite_for(user_id)
    PlaylistInvite.user_invited_to(user_id, self.id).first
  end

  def link_invite(type = 'everyone')
    PlaylistInvite.where(invite_type: "link_#{type}", playlist_id: self.id).first
  end

end