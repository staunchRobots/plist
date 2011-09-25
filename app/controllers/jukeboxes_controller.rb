class JukeboxesController < InheritedResources::Base
  nested_belongs_to :user, :finder => :find_by_username
end
