class CreateVideos < ActiveRecord::Migration
  def self.up
    create_table :videos do |t|
      t.string :ytid
      t.boolean :hot
      t.integer :hottness
      t.string :title
      t.boolean :featured
      t.integer :playlist_id
      t.integer :sort

      t.timestamps
    end
  end

  def self.down
    drop_table :videos
  end
end
