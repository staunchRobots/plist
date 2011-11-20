module PlaylistHelper
  def myown_playlist
    @playlist && current_user && (@playlist.user == current_user || @playlist.members.include?(current_user))
  end

  def copy_playlists_list(ytid, is_dynamic_video = false)
    pls = current_user.playlists
    pls.reject!{|x| x.videos.any?{|v| v.ytid == ytid}}
    pls.reject!{|x| x.id == @playlist.id} if !is_dynamic_video
    content_tag :ul do
      pls.collect{|p|
        c = content_tag :li, :class => 'menu_action' do
          link_to p.title, playlist_videos_path(p.id, :video => {:yt_url => ytid, :is_ytid => '1'}, :current_playlist => @playlist.id), :remote => true, :method => :post
        end
        concat c
      }
    end
  end

  def move_playlists_list(video_id, ytid, is_dynamic_video = false)
    pls = current_user.playlists
    pls.reject!{|x| x.videos.any?{|v| v.ytid == ytid}}
    pls.reject!{|x| x.id == @playlist.id} if myown_playlist && !is_dynamic_video
    content_tag :ul do
      pls.collect{|p|
        c = content_tag :li, :class => 'menu_action' do
          link_to p.title, move_playlist_video_path(@playlist.id, video_id, {:to_playlist => p.id, :current_playlist => @playlist.id}), :remote => true, :method => :post
        end
        concat c
      }
    end
  end

  def shared_playlits
    return unless current_user
    collab_playlist_ids = Collaborator.where(:user_id => current_user.id).collect(&:id).uniq
    pls = Playlist.where(:id => collab_playlist_ids)
    content_tag :ul do
      pls.collect{|p|
        c = content_tag :li, :class => 'menu_action' do
          link_to p.title, p
        end
        concat c
      }
    end
  end


end