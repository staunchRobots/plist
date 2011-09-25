class CreateJukeboxes < ActiveRecord::Migration
  def self.up
    create_table :jukeboxes do |t|
      t.string :title
      t.string :current_song
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :jukeboxes
  end
end
