Web::Application.routes.draw do
  resources :playlist
  match "/playlist/sort" => "playlist#sort", :via => :post

  match "/login" => "accounts#login", :via => :post
  match "/logout" => "accounts#logout", :via => :post

  root :to => "index#index"
end
