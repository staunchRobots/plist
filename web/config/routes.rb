Web::Application.routes.draw do
  match "/me" => "index#me"
                            
  resources :remote do 
    get :connect, :on => :member
    post :connect_now, :on => :member
    get :next, :on => :member
    get :prev, :on => :member
    post :switch, :on => :member
    get :check_out, :on => :member
    
  end
  
  namespace :admin do
    get "featured" => "featured_videos#index"
    post "featured" => "featured_videos#update"
    # resources :featured, :only => [:index, :update], :controller => :featured_videos
  end

  # Routes for anonymous
  match "/playlist/:playlist/videos" => "playlist#get_videos", :via => :get
  match "/playlist/:playlist/videos" => "playlist#post_video", :via => :post
  match "/playlist/:playlist/videos/:id" => "playlist#put_video", :via => :put
  match "/playlist/:playlist/videos/:id" => "playlist#delete_video", :via => :delete
  match "/playlist/:playlist" => "playlist#update", :via => :post
  match "/playlist/:playlist" => "playlist#destroy", :via => :delete


  match "/playlist/:playlist/sort" => "playlist#sort", :via => :post
  match "/playlists" => "playlist#index", :via => :get

  resources :playlist
  resources :playlists
  resources :suggestions

  match "/home" => "home#index", :via => :get

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
  match "/:member/:playlist/new" => "playlists#new", :via => :get
  match "/:member/:playlist" => "playlists#show", :via => :get
  match "/:member/:playlist" => "playlists#update", :via => :put
  match "/:member/:playlist" => "playlists#destroy", :via => :delete
  # Video routes for members
  match "/:member/:playlist/videos" => "playlists#get_videos", :via => :get
  match "/:member/:playlist/videos" => "playlists#post_video", :via => :post
  match "/:member/:playlist/videos" => "playlists#put_video", :via => :put
  match "/:member/:playlist/videos" => "playlists#delete_video", :via => :delete

  root :to => "home#index"
end
