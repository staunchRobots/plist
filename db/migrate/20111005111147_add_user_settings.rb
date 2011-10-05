class AddUserSettings < ActiveRecord::Migration
  def self.up
    add_column  :users, :show_filtered_videos, :boolean, :default => false
    add_column  :users, :show_plisted, :boolean, :default => false
  end

  def self.down
    remove_column :users, :show_filtered_videos
    remove_column :users, :show_plisted
  end
end
