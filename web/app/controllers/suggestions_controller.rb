class SuggestionsController < ApplicationController
  def index
    @suggestions= current_member.suggestions
    respond_to do |format|
      format.html { render :partial => "playlists/suggestions" }
    end
  end

  def create
    params[:suggestions].each do |k,v|
      unless Suggestion.exists?(:conditions=>v)
        v[:fb_name]= params[:actors][v[:fb_uid]][:name]
        current_member.suggestions << Suggestion.new(v)
      end
    end
    respond_to do |format|
      format.html { render :text => "ok" }
    end
  end

  def destroy
  end
end
