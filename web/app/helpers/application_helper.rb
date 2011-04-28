module ApplicationHelper
  def sites_thumb(site, size="small")
    file= ""
    case site
    when "groupon"
      file= "groupon_30x30.png" if size=="small"
      file= "groupon_50x50.png" if size=="medium"
    when "opentable"
      file= "opentable_30x30.png" if size=="small"
      file= "opentable_50x50.png" if size=="medium"
    when "kgb_deals"
      file= "kgb_deals_30x30.png" if size=="small"
      file= "kgb_deals_50x50.png" if size=="medium"
    when "travel_zoo"
      file= "travelzoo_30x30.png" if size=="small"
      file= "travelzoo_50x50.png" if size=="medium"
    when "living_social"
      file= "livingsocial_30x30.png" if size=="small"
      file= "livingsocial_50x50.png" if size=="medium"
    else
      file= "livingsocial_50x50.png" if size=="medium"
      file= "livingsocial_30x30.png" if size=="small"
    end
    "/images/site-icons/#{file}"
  end

  def random_digits
    rand(100000).to_f/100000
  end

  def random_digits_nyc
    lat= rand(100000)
    while(lat < 68333 || lat > 78333)
      lat= rand(100000)
    end
    lat= lat.to_f/100000
    lng= rand(100000)
    while(lng < 75000 || lat > 91667)
      lng= rand(100000)
    end
    lng= lng.to_f/100000
    return [40.to_f+lat,-73.to_f-lng]
  end

  def time_diff(from_time, to_time)
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time = to_time.to_time if to_time.respond_to?(:to_time)
    distance_in_seconds = ((to_time - from_time).abs).round
    components = []
    
    %w(year month day hour minute).each do |interval|
      # For each interval type, if the amount of time remaining is greater than
      # one unit, calculate how many units fit into the remaining time.
      if distance_in_seconds >= 1.send(interval)
        delta = (distance_in_seconds / 1.send(interval)).floor
        distance_in_seconds -= delta.send(interval)
        components << pluralize(delta, interval).gsub!(/\s/, '')
      end
    end
    begin
      components.join(" ").gsub!(/minutes|minute/, 'min').gsub!(/hours|hour/, 'h')
    rescue => e
      return ""
    end
  end
end
