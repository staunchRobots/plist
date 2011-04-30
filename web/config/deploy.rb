ssh_options[:forward_agent] = true
default_run_options[:pty] = true

set :application, "pList.tv"
set :repository,  "git@github.com:santiago/vjcloud.git"
set :domain, "root@173.230.129.222"
set :deploy_to, "/srv/www/plisttv-dev" 
set :port, 22

role :web, domain               # Your HTTP server, Apache/etc
role :app, domain               # This may be the same as your `Web` server
role :db, domain, :primary => true # This is where Rails migrations will run

# set :deploy_via, :remote_cache  # If you have public like github.com then use :remote_cache
set :scm, 'git'
set :branch, 'dev'
set :scm_verbose, true
set :scm_username, "git"
set :deploy_via, "checkout"
set :use_sudo, false

task :staging do
  set :rails_env, "development" # for now
  server "173.230.129.222", :app, :web, :db, :primary => true
  #set :bundle, "bundle"
  set :deploy_to, "/srv/gbd"
  ssh_options[:username] = 'gbd'
  set :gem_bin, "/home/#{ssh_options[:username]}/.rvm/gems/ree-1.8.7-2011.03@charts/bin"
  set :rvm_bin, "/home/#{ssh_options[:username]}/.rvm/bin"
end

namespace :bundler do
  task :create_symlink, :roles => :app do
    shared_dir = File.join(shared_path, 'bundle')
    release_dir = File.join(current_release, '.bundle')
    run("mkdir -p #{shared_dir} && ln -s #{shared_dir} #{release_dir}")
  end
 
  task :bundle_new_release, :roles => :app do
    bundler.create_symlink
    run "cd #{release_path} && bundle install --without test"
  end
end
 
namespace :deploy do
  desc "Restarting mod_rails with restart.txt"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end

  [:start, :stop].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end
end


desc "remove web directory"
task :remove_web, :roles => :app do
  run "cd #{release_path} && cp -R web/* ."
  run "cd #{release_path} && rm -rf web"
  puts (run "cd #{release_path} && ls")
end
after "deploy:update_code", :remove_web

desc "install the necessary prerequisites"
task :bundle_install, :roles => :app do
  run "cd #{release_path} && bundle install"
end

after "deploy:update_code", :bundle_install
#after "deploy:update_code", "deploy:assets"
#after "deploy:update_code", "deploy:symlink_shared"
