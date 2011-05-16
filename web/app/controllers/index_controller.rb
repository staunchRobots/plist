# -*- coding: undecided -*-
class IndexController < ApplicationController
  before_filter :is_logged_in?
  skip_before_filter :require_user

  def index
    # @editable= true
    # if session[:fbsession]
    #   @member= Member.find(session[:member])
    #   if @member.username
    #     redirect_to "/#{@member.username}"
    #   else
    #     redirect_to "/#{@member.fb_uid}"
    #   end
    # else
    redirect_to "/home"
    # end
  end

  def me
    if session[:fbsession]
      @member= Member.find(session[:member])
      if @member.username
        redirect_to "/#{@member.username}"
      else
        redirect_to "/#{@member.fb_uid}"
      end
    end    
  end

  private
  def is_logged_in?
    if (session[:member])
      @member= Member.find(session[:member])
      # redirect_to "/#{@member.username}"
    end
  end
end
