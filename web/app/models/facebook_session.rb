class FacebookSession
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :user_id, :type => String
  field :uid, :type=> String
  field :expires, :type=> Integer
  field :access_token, :type => String
  field :session_key, :type => String
  field :secret, :type => String
  field :sig, :type => String

  def self.create_session(session)
    unless User.exists?(:conditions => {:fb_uid => session['uid']})
      @user= User.create({:username => session['uid'], :fb_uid => session['uid']})
    else
      @user= User.where({:fb_uid => session['uid']})
    end
    unless session_exists?(session['session_key'])
      session[:user_id]= @user._id
      create(session)
    end
  end

  def self.destroy_session(session_key)
    session= where({:session_key => session_key}).destroy!
  end

  private
  def session_exists?(session_key)
    Session.exists?(:conditions => {:session_key => session_key})
  end
end
