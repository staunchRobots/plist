class UsersController < InheritedResources::Base
  before_filter :authenticate_user!
  defaults :finder => :find_by_username
  respond_to :js, :html

  def update
    if current_user.id == params[:id].to_i
      @user = User.find(params[:id])
      @user.update_attributes(params[:user])
      @user.show_filtered_videos = !@user.show_filtered_videos
      @user.show_plisted = !@user.show_plisted
      unless @user.save
        @errors = @user.errors.full_messages
      end
    else
      @errors = ["You can't edit other user"]
    end
    respond_to do |format|
      format.js
    end
  end

end