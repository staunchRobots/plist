class UsersController < InheritedResources::Base
  before_filter :authenticate_user!
  defaults :finder => :find_by_username
  respond_to :js, :html

  def update
    if current_user.username == params[:id]
      @user = User.find_by_username(params[:id])
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
      if params[:user][:avatar]
        format.html { redirect_to '/'}
      else
        format.js { render :content_type => 'text/javascript' }
      end
    end
  end

end