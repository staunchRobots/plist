class CreatePlaylistVideos < ActiveRecord::Migration
  def self.up
    create_table :playlist_videos do |t|
      t.integer :playlist_id
      t.integer :video_id
      t.integer :order

      t.timestamps
    end
  end

  def self.down
    drop_table :playlist_videos
  end
end
