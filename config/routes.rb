Plist::Application.routes.draw do
  devise_for :users, :controllers => { :registrations => "registrations", :sessions => "sessions" }

  resources :users do
    resources :playlists
    resources :jukeboxes
    post '/videos/love' => 'videos#love', :on => :member
    post '/videos/hate' => 'videos#hate', :on => :member
  end

  resources :playlists do
    post :ask_for_promotion, :on => :member
    post :published, :on => :member
    post :options, :on => :member
    resources :videos do
      post :reorder, :on => :collection
      post :ytsearch, :on => :collection
      post :move, :on => :member
    end
    # post :add_video, :on => :member
  end

  resources :invites, :only => [:create] do
    get :accept, :on => :collection
  end

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "logout", :to => "devise/sessions#destroy"
  end

  namespace :admin do
    get "featured" => "featured_videos#index"
    post "featured" => "featured_videos#update"
    get "recent" => "recent_videos#index"
    # resources :featured, :only => [:index, :update], :controller => :featured_videos
  end

  root :to => 'home#index'
end
