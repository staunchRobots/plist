class VideosController < InheritedResources::Base
  nested_belongs_to :playlist
  respond_to :js, :html

  def create
    @playlist = Playlist.find(params[:playlist_id])
    @at_current_url = params[:current_playlist].to_i == @playlist.id
    @is_url = params[:video][:is_ytid] ? false : true
    @video = @playlist.add_video(params[:video][:yt_url], @is_ytid)
    respond_to do |format|
      if @video
        format.js
      else
        render :nothing => true
      end
    end
  end

  def move
    @video = Video.find(params[:id])
    @video.update_attribute(:playlist_id, params[:to_playlist])
    @old_playlist = Playlist.find(params[:playlist_id])
    @new_playlist = Playlist.find(params[:to_playlist])
    respond_to do |format|
      if @video
        format.js
      else
        render :nothing => true
      end
    end
  end

  def destroy
    @playlist = Playlist.find(params[:playlist_id])
    @video = @playlist.videos.find(params[:id])
    @id = @video.id
    @video.destroy
    respond_to do |format|
      format.html
      format.js
    end
  end

  def reorder
    @playlist = Playlist.find(params[:playlist_id])
    if @playlist.accessible_by(current_user)
      @playlist.update_videos_sort_order(params[:order])
      @updated = true
    end

    respond_to do |format|
      format.js
    end

  end

  def ytsearch
    @playlist = Playlist.find(params[:current_playlist])
    @is_pagination_search = params[:video][:page].nil?
    @videos = Youtube.ytsearch(params[:video][:search], current_user, {
      'start-index' => (params[:video][:page].to_i * 10)+1,
      :restriction  => request.remote_ip
      })
    respond_to do |format|
      format.js
    end
  end

  def love
    respond_to do |format|
      format.js
    end
  end

  def hate
    @ytid = params[:ytid]
    unless UserHate.exists?(:user_id => current_user.id, :ytid => params[:ytid])
      @uh = UserHate.find_or_create_by_user_id_and_ytid(current_user.id, params[:ytid])
    else
      @uh = false
    end

    respond_to do |format|
      format.js
    end
  end


end
