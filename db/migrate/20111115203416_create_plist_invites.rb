class CreatePlistInvites < ActiveRecord::Migration
  def self.up
    create_table :plist_invites do |t|
      t.integer :playlist_id
      t.integer :user_id
      t.string :notes
      t.string :invite_token

      t.timestamps
    end
  end

  def self.down
    drop_table :plist_invites
  end
end
