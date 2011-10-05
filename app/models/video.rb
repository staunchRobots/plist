class Video < ActiveRecord::Base
  belongs_to :playlist

  validates_presence_of :ytid

  before_create :parse_youtube

  private

    def parse_youtube
      if ytid.match(/\?/) || ytid.match(/\&/)
       tmpid = ytid.gsub(/.*\?/, '').split('&').find{|r| r.match /v=.*/}
       self.ytid = tmpid[2..-1] if tmpid
      end

      properties = Youtube.get_properties(ytid)
      self.title = properties[:title]
    end

end
