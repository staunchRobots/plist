class AddInviteKind < ActiveRecord::Migration
  def self.up
    add_column :playlist_invites, :invite_type, :string, default: 'user'
  end

  def self.down
    remove_column :playlist_invites, :invite_type
  end
end
