class Suggestion
  include Mongoid::Document
  include Mongoid::Timestamps
  
  belongs_to :member

  field :ytid, :type => String
  field :title, :type => String
  field :thumb, :type => String
  field :author, :type => String
  field :fb_name, :type=> String
  field :fb_uid, :type=> String
  field :status, :type=> String

  before_create :youtube

  private
  def youtube
    yt_feed= RestClient.get("http://gdata.youtube.com/feeds/api/videos/#{self.ytid}?v=2&alt=json")
    yt_video= JSON.parse(yt_feed)
    title= yt_video["entry"]["title"]["$t"]
    authors= [];
    yt_video["entry"]["author"].each do |a|
      author= {'name' => a["name"]["$t"], 'uri' => a["uri"]["$t"]}
      authors << author
    end
    self.thumb= "http://img.youtube.com/vi/#{self.ytid}/2.jpg"
    self.title= title
    self.author= authors
    self.status= "new"
  end
end
