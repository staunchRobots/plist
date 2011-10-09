class SessionsController < Devise::SessionsController

  def create
    super do |format|
      format.js
    end
  end

  def new
    redirect_to '/'
  end
end