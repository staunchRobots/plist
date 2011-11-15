module ApplicationHelper
  def title(page_title)
    content_for(:title) { page_title }
  end

  def description(description)
    content_for(:description) { description }
  end

  # Formatted date
  def d(date)
    date.to_s(:short) if date
  end

  def avatar_url(user)
    if user.avatar_file_name.present?
      user.avatar.url(:thumb)
    else
      default_url = "#{root_url}images/guest.png"
      gravatar_id = Digest::MD5.hexdigest(user.email.downcase)
      "http://gravatar.com/avatar/#{gravatar_id}.png?s=48&d=#{CGI.escape(default_url)}"
    end
  end

  def broadcast(channel, &block)
    message = {:channel => channel, :data => capture(&block), :ext => {:auth_token => FAYE_TOKEN}}
    uri = URI.parse("http://localhost:9292/faye")
    Net::HTTP.post_form(uri, :message => message.to_json)
  end
end
