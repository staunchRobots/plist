class FacebookSession
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :uid, :type=> String
  field :expires, :type=> Integer
  field :access_token, :type => String
  field :session_key, :type => String
  field :secret, :type => String
  field :sig, :type => String

  belongs_to :member

  def self.create_session(session)
    unless Member.exists?(:conditions => {:fb_uid => session['uid']})
      @member= Member.create({:username => session['uid'], :fb_uid => session['uid']})
      puts "new"
    else
      @member= Member.first(:conditions => {:fb_uid => session['uid']})
      puts "current"
    end
    # Bind FB session to local session
    if session_exists?(session['session_key'])
      puts "exists session"
      { :fbsession => {:session_key=>session['session_key']}, :member => @member._id }
    else
      puts "create session"
      @member.facebook_sessions << session
      { :fbsession => {:session_key=>session['session_key']}, :member => @member._id }
    end
  end

  def self.destroy_session(session_key)
    session= self.where({:session_key => session_key}).destroy
  end

  private
  def self.session_exists?(session_key)
    
    self.exists?(:conditions => {:session_key => session_key})
  end
end
