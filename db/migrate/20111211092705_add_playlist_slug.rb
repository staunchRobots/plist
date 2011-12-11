class AddPlaylistSlug < ActiveRecord::Migration
  def self.up
    add_column :playlists, :slug, :string
    add_index :playlists, :slug, :unique => true
  end

  def self.down
    remove_column :playlists, :slug
  end
end
