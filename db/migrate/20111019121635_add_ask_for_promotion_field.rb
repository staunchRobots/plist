class AddAskForPromotionField < ActiveRecord::Migration
  def self.up
    add_column :playlists, :ask_for_promotion, :integer, :default => 0
  end

  def self.down
    remove_column :playlists, :ask_for_promotion
  end
end
