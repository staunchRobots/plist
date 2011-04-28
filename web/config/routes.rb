Web::Application.routes.draw do
  resources :playlist
  match "/playlist/sort" => "playlist#sort"
  root :to => "index#index"
end
