class FacebookSession
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :member_id, :type => String
  field :uid, :type=> String
  field :expires, :type=> Integer
  field :access_token, :type => String
  field :session_key, :type => String
  field :secret, :type => String
  field :sig, :type => String

  belongs_to :member

  def self.create_session(session)
    unless Member.exists?(:conditions => {:fb_uid => session['uid']})
      puts "new"
      @member= Member.create({:username => session['uid'], :fb_uid => session['uid']})
    else
      puts "current"
      @member= Member.first(:conditions => {:fb_uid => session['uid']})
    end
    # Bind FB session to local session
    if session_exists?(session['session_key'])
      { :fbsession => self.first(:conditions => {:session_key=>session['session_key']}), :member => @member }
    else
      { :fbsession => create(session), :member => @member }
    end
  end

  def self.destroy_session(session_key)
    session= where({:session_key => session_key}).destroy!
  end

  private
  def self.session_exists?(session_key)
    exists?(:conditions => {:session_key => session_key})
  end
end
