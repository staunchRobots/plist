# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120414170915) do

  create_table "collaborators", :force => true do |t|
    t.integer  "playlist_id"
    t.integer  "user_id"
    t.string   "perms"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "collaborators", ["playlist_id"], :name => "index_collaborators_on_playlist_id"
  add_index "collaborators", ["user_id"], :name => "index_collaborators_on_user_id"

  create_table "jukeboxes", :force => true do |t|
    t.string   "title"
    t.string   "current_song"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "jukeboxes", ["user_id"], :name => "index_jukeboxes_on_user_id"

  create_table "messages", :force => true do |t|
    t.integer  "user_id"
    t.integer  "playlist_id"
    t.string   "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "onlines", :force => true do |t|
    t.integer  "user_id"
    t.integer  "playlist_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "playlist_invites", :force => true do |t|
    t.integer  "playlist_id"
    t.integer  "user_id"
    t.string   "notes"
    t.string   "invite_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "invite_type",  :default => "user"
  end

  add_index "playlist_invites", ["playlist_id"], :name => "index_playlist_invites_on_playlist_id"
  add_index "playlist_invites", ["user_id"], :name => "index_playlist_invites_on_user_id"

  create_table "playlist_videos", :force => true do |t|
    t.integer  "playlist_id"
    t.integer  "video_id"
    t.integer  "order"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "playlist_videos", ["playlist_id"], :name => "index_playlist_videos_on_playlist_id"
  add_index "playlist_videos", ["video_id"], :name => "index_playlist_videos_on_video_id"

  create_table "playlists", :force => true do |t|
    t.string   "title"
    t.string   "thumb"
    t.boolean  "hot"
    t.integer  "hottness"
    t.boolean  "featured"
    t.boolean  "published",                       :default => true
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "description",       :limit => 80
    t.integer  "ask_for_promotion",               :default => 0
    t.string   "slug"
  end

  add_index "playlists", ["slug"], :name => "index_playlists_on_slug", :unique => true
  add_index "playlists", ["user_id"], :name => "index_playlists_on_user_id"

  create_table "user_hates", :force => true do |t|
    t.integer  "user_id"
    t.string   "ytid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_hates", ["user_id"], :name => "index_user_hates_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "username"
    t.string   "avatar_url"
    t.boolean  "is_admin"
    t.boolean  "show_filtered_videos"
    t.boolean  "show_plisted"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "videos", :force => true do |t|
    t.string   "ytid"
    t.boolean  "hot"
    t.integer  "hottness"
    t.string   "title"
    t.boolean  "featured"
    t.integer  "playlist_id"
    t.integer  "sort"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "videos", ["playlist_id"], :name => "index_videos_on_playlist_id"

end
