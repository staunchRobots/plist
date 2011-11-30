class ApplicationController < ActionController::Base
  protect_from_forgery

  private
    def has_access_to(user, playlist)
      playlist && user && (playlist.user == user || playlist.members.include?(user) || playlist.invited_members.include?(user))
    end

end