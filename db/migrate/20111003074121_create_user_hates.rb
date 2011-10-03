class CreateUserHates < ActiveRecord::Migration
  def self.up
    create_table :user_hates do |t|
      t.integer :user_id
      t.string :ytid

      t.timestamps
    end
  end

  def self.down
    drop_table :user_hates
  end
end
