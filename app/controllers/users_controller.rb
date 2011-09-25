class UsersController < InheritedResources::Base
  # before_filter :authenticate_user!
  defaults :finder => :find_by_username
end