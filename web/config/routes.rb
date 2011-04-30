Web::Application.routes.draw do
  match "/playlist" => "playlist#add", :via => :post

  resources :playlist
  resources :playlists
  match "/playlist/sort" => "playlist#sort", :via => :post

  match "/login" => "accounts#login", :via => :post
  match "/logout" => "accounts#logout", :via => :post

  match "/:member" => "playlists#index", :via => :get
  root :to => "index#index"
end
