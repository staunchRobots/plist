class RegistrationsController < Devise::RegistrationsController

  def after_sign_up_path_for(resource)
    user_playlist_path(resource, resource.playlists.first)
  end

end