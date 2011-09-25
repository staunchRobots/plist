module PlaylistHelper
  def myown_playlist
    @playlist && current_user && @playlist.user == current_user
  end

  def copy_playlists_list(ytid)
    pls = current_user.playlists.includes(:videos)
    pls.reject!{|x| x.videos.any?{|v| v.ytid == ytid}}
    pls.reject!{|x| x.id == @playlist.id} if myown_playlist
    content_tag :ul do
      pls.collect{|p|
        c = content_tag :li do
          link_to p.title, playlist_videos_path(p.id, :video => {:yt_url => ytid, :is_ytid => '1'}), :remote => true, :method => :post
        end
        concat c
      }
    end
  end

  def move_playlists_list(video_id, ytid)
    pls = current_user.playlists.includes(:videos)
    pls.reject!{|x| x.videos.any?{|v| v.ytid == ytid}}
    pls.reject!{|x| x.id == @playlist.id} if myown_playlist
    content_tag :ul do
      pls.collect{|p|
        c = content_tag :li do
          link_to p.title, move_playlist_video_path(@playlist.id, video_id, :to_playlist => p.id), :remote => true, :method => :post
        end
        concat c
      }
    end
  end
end