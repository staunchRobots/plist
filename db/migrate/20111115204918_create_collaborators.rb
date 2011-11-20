class CreateCollaborators < ActiveRecord::Migration
  def self.up
    create_table :collaborators do |t|
      t.integer :playlist_id
      t.integer :user_id
      t.string :perms

      t.timestamps
    end
  end

  def self.down
    drop_table :collaborators
  end
end
