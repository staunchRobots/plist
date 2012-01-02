module LinksHelper
  def plist_user_link plist, opts={}
    link_to plist.username, plist.user, opts
  end

  def plist_link plist, opts={}, &block
    title = block_given? ? capture(&block) : plist.title
    link_to title, user_playlist_path(plist.user, plist.id), opts
  end
end