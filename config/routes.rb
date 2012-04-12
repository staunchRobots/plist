Plist::Application.routes.draw do
  default_url_options :host => Settings.default_host

  devise_for :users, :controllers => { :registrations => "registrations", :sessions => "sessions" }

  resources :users do
    resources :playlists do
      get :shared, on: :collection
      get :watch, :on => :member
      get :play, :on => :member
    end
    resources :jukeboxes
  end

  resources :playlists do
    member do
      post :ask_for_promotion
      post :published
      post :options
    end
    resources :videos do
      post :move, :on => :member
      collection do
        post :reorder
        post :ytsearch
      end
    end
  end

  resources :invites, :only => [:create] do
    collection do
      get :accept
      get :autocomplete
      get :generate_for_everyone
      get :generate_for_plisters
    end
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
