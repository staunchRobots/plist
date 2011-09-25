class CreatePlaylists < ActiveRecord::Migration
  def self.up
    create_table :playlists do |t|
      t.string :title
      t.string :thumb
      t.boolean :hot
      t.integer :hottness
      t.boolean :featured
      t.boolean :published
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :playlists
  end
end
