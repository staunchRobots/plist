ssh_options[:forward_agent] = true
default_run_options[:pty] = true

set :application, "pList.tv"
set :repository,  "git@github.com:morrillt/plisttv.git"
set :domain, "173.230.129.222"
set :deploy_to, "/srv/www/plisttv"
set :port, 22
ssh_options[:username] = 'www'

role :web, domain               # Your HTTP server, Apache/etc
role :app, domain               # This may be the same as your `Web` server
role :db, domain, :primary => true # This is where Rails migrations will run

set :scm, 'git'
set(:branch, 'master') unless exists?(:branch)
set :scm_verbose, true
set :scm_username, "git"
set :deploy_via, "checkout"
set :use_sudo, false

task :staging do
  set :rails_env, "staging" # for now
  ssh_options[:username] = 'www'
  set :deploy_to, "/srv/www/plisttv-dev"
  # server "173.230.129.222", :app, :web, :db, :primary => true
  # set :bundle, "bundle"
  # set :gem_bin, "/home/#{ssh_options[:username]}/.rvm/gems/ree-1.8.7-2011.03@charts/bin"
  # set :rvm_bin, "/home/#{ssh_options[:username]}/.rvm/bin"
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

  task :assets_symlink, :roles => :app do
    shared_dir = File.join(shared_path, 'assets')
    release_dir = File.join(current_release, 'public', 'assets')
    run("mkdir -p #{shared_dir} && ln -s #{shared_dir} #{release_dir}")
  end
end

namespace :sass do
  desc 'Updates the stylesheets generated by Sass'
  task :update, :roles => :app do
    # invoke_command "cd #{latest_release}; RAILS_ENV=#{rails_env} rake sass:update"
    shared_dir = File.join(shared_path, 'assets')
    run "rm #{shared_dir}/*"
  end

  # Generate all the stylesheets manually (from their Sass templates) before each restart.
  before 'deploy:restart', 'sass:update'
end

desc "install the necessary prerequisites"
task :bundle_install, :roles => :app do
  run "cd #{release_path} && bundle install"
end

after "deploy:update_code", :bundle_install
after "deploy:update_code", "deploy:assets_symlink"