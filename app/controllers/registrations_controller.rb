class RegistrationsController < Devise::RegistrationsController

  def create
    super do |format|
      format.js
    end
  end

  def after_sign_up_path_for(resource)
    sign_in :user, resource # Sign in after sign up
  end

end