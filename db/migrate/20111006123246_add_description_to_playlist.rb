class AddDescriptionToPlaylist < ActiveRecord::Migration
  def self.up
    add_column :playlists, :description, :string, :limit => 80
  end

  def self.down
    remove_column :playlists, :description
  end
end
