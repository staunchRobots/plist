Plist::Application.routes.draw do
  devise_for :users, :controllers => { :registrations => "registrations" }

  resources :users do
    resources :playlists
    resources :jukeboxes
  end

  resources :playlists do
    post :published, :on => :member
    resources :videos do
      post :reorder, :on => :collection
      post :ytsearch, :on => :collection
      post :move, :on => :member
    end
    # post :add_video, :on => :member
  end

  devise_scope :user do
    get "login", :to => "devise/sessions#new"
    get "logout", :to => "devise/sessions#destroy"
  end

  namespace :admin do
    get "featured" => "featured_videos#index"
    post "featured" => "featured_videos#update"
    # resources :featured, :only => [:index, :update], :controller => :featured_videos
  end


  root :to => 'home#index'
end
