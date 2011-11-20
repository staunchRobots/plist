class UserMailer < ActionMailer::Base
  default :from => "from@plist.tv"
  
  def collaboration_invite(invite)
    @invite = invite
    mail(:to => @invite.user.email, 
      :subject => "you've been invited to collaborate on #{@invite.playlist.title}") do |format|
      format.html
    end
  end

end
