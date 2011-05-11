Web::Application.routes.draw do
  # Routes for anonymous
  match "/playlist/:playlist/videos" => "playlist#get_videos", :via => :get
  match "/playlist/:playlist/videos" => "playlist#post_video", :via => :post
  match "/playlist/:playlist/videos/:id" => "playlist#put_video", :via => :put
  match "/playlist/:playlist/videos/:id" => "playlist#delete_video", :via => :delete

  match "/playlist/:playlist/sort" => "playlist#sort", :via => :post
  match "/playlists" => "playlist#index", :via => :get

  resources :playlist
  resources :playlists

  # Accounts
  match "/login" => "accounts#login", :via => :post
  match "/logout" => "accounts#logout", :via => :post
  match "/signup" => "accounts#post_signup", :via => :post
  match "/accounts/username" => "accounts#username", :via => :post

  # Member Aliases for /playlists
  match "/:member" => "member#index", :via => :get

  match "/:member/playlists" => "playlists#index", :via => :get
  match "/:member/playlists" => "playlists#create", :via => :post

  match "/:member/:playlist/edit" => "playlists#edit", :via => :get
  match "/:member/:playlist" => "playlists#show", :via => :get
  match "/:member/:playlist" => "playlists#update", :via => :put
  match "/:member/:playlist" => "playlists#destroy", :via => :delete
  # Video routes for members
  match "/:member/:playlist/videos" => "playlists#get_videos", :via => :get
  match "/:member/:playlist/videos" => "playlists#post_video", :via => :post
  match "/:member/:playlist/videos" => "playlists#put_video", :via => :put
  match "/:member/:playlist/videos" => "playlists#delete_video", :via => :delete

  root :to => "index#index"
end
