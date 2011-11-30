class RenamePlistinvites < ActiveRecord::Migration
  def self.up
    rename_table :plist_invites, :playlist_invites
  end

  def self.down
    rename_table :playlist_invites, :plist_invites
  end
end
