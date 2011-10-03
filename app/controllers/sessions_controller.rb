class SessionsController < Devise::SessionsController
  def new 
    redirect_to '/'
  end
end