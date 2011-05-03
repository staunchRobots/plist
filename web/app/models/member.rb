class Member
  include Mongoid::Document
  include Mongoid::Timestamps
  
  has_many :playlists
  has_many :facebook_sessions

  field :username, :type => String
  field :fb_first_name, :type=> String
  field :fb_last_name, :type=> String
  field :fb_name, :type=> String
  field :fb_uid, :type => String
  field :fb_birthday, :type=> String
  field :fb_email, :type => String
  field :fb_timezone, :type => Integer

  def signup(member)
    self.update_attributes({
                             :fb_first_name => member[:first_name],
                             :fb_last_name => member[:last_name],
                             :fb_name => member[:name],
                             :fb_birthday => member[:birthday],
                             :fb_email => member[:email],
                             :fb_timezone => member[:timezone]
                           })
    puts "llega aqui como sea pues!"
  end

  def update_username(username)
    puts username+"oeoeoe"
    return {:error => "Username is already taken"} if Member.exists?(:conditions => {:username => username})
    return {:error => "Username should only be 15 characters long"} if (username.size > 15)
    return {:error => "Username should only contain characters, numbers or underscore"} unless (username[/^[^_][a-zA-Z0-9_]+[^_]$/])
    self.update_attributes({:username => username})
  end
end
