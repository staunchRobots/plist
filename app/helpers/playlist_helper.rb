module PlaylistHelper
  def myown_playlist
    @playlist && current_user && (@playlist.user == current_user || @playlist.members.include?(current_user))
  end
  
  def user_invited?
    PlaylistInvite.user_invited_to(current_user.id, @playlist.id).count > 0
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

  def pl_path(p)
    link_to p.title, user_playlist_path(p.user.username, p), :class => 'title'
  end

  def shared_playlits
    return unless current_user
    shared_with = Playlist.shared_with(current_user.id)
    shared_by_me = Playlist.shared_by(current_user.id)
    invites = PlaylistInvite.for_user(current_user.id)
    content_tag :ul do
      unless shared_with.empty?
        c = content_tag :li, :class => 'menu_head' do
          "Shared with me"
        end
        concat c

        shared_with.collect{|p|
          c = content_tag :li, :class => 'menu_action' do
            pl_path(p)
          end
          concat c
        }
      end

      unless shared_by_me.empty?
        c = content_tag :li, :class => 'menu_head' do
          "Shared by me"
        end
        concat c

        shared_by_me.collect{|p|
          c = content_tag :li, :class => 'menu_action' do
            pl_path(p)
          end
          concat c
        }
      end

      unless invites.empty?
        c = content_tag :li, :class => 'menu_head' do
          "Invited to"
        end
        concat c

        invites.collect{|i|
          c = content_tag :li, :class => 'menu_action' do
            d = ''
            d << pl_path(i.playlist)
            d << link_to("accept", accept_invites_url(:token => i.invite_token), class: 'blue minibutton')
            d.html_safe
          end
          concat c
        }
      end

    end
  end


end