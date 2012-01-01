class AddTablesIndexes < ActiveRecord::Migration
  def self.up
    add_index :collaborators, :playlist_id
    add_index :collaborators, :user_id
    add_index :jukeboxes, :user_id
    add_index :playlist_invites, :playlist_id
    add_index :playlist_invites, :user_id
    add_index :playlist_videos, :playlist_id
    add_index :playlist_videos, :video_id
    add_index :playlists, :user_id
    add_index :user_hates, :user_id
    add_index :videos, :playlist_id
  end

  def self.down
    remove_index :collaborators, :playlist_id
    remove_index :collaborators, :user_id
    remove_index :jukeboxes, :user_id
    remove_index :playlist_invites, :playlist_id
    remove_index :playlist_invites, :user_id
    remove_index :playlist_videos, :playlist_id
    remove_index :playlist_videos, :video_id
    remove_index :playlists, :user_id
    remove_index :user_hates, :user_id
    remove_index :videos, :playlist_id
  end
end