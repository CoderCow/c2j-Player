# NOTE: the windows user invoking vagrant for the first provisioning of this box requires the permission to create 
# windows symlinks. so either first time invoke "vagrant up" as admin or give your current user the proper permission!

# All Vagrant configuration is done below. The "2" in Vagrant.configure configures the configuration version 
# (we support older styles for backwards compatibility). Please don't change it unless you know what you're doing.
Vagrant.configure("2") do |config|
  # Configuration options reference: https://www.vagrantup.com/docs/vagrantfile/machine_settings.html

  # note: do not use the "official" ubuntu box (ubuntu/xenial64) as several issues have been reported regarding it.
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.box_check_update = false

  # the webpack dev server runs on 8080
  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1", protocol: "tcp"
  # apache runs on 80
  config.vm.network "forwarded_port", guest: 80, host: 8181, host_ip: "127.0.0.1", protocol: "tcp"

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    #vb.gui = true

    # Customize the amount of memory on the VM:
    vb.memory = "256"
  end

  config.vm.provision "shell", inline: <<-SHELL
    declare -r DEFAULT_NODE_VERSION=7.8.0
    set -e

    timedatectl set-timezone 'Europe/Berlin'

    # add the asp.net core feed
    echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893

    # add docker feed
    echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" > /etc/apt/sources.list.d/docker.list
    apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
    chmod u=rw,g=,o= /etc/apt/sources.list.d/docker.list

    apt-get update

    # intall utilities
    apt-get --assume-yes install nano tmux

    # install dotnet
    apt-get --assume-yes install dotnet-dev-1.0.1 

    # install apache2
    #apt-get --assume-yes install apache2 libapache2-mod-shib2
    #a2enmod proxy proxy_http shib2

    # overwrite apache's default site configuration
    #cp /vagrant/vagrant-assets/000-default.conf /etc/apache2/sites-available/
    # register a systemd service to run the asp.net core application
    #cp /vagrant/vagrant-assets/webapi.service /etc/systemd/system/

    # enable autostart of the asp.net core app
    #systemctl enable webapi.service

    # install nvm / npm requirements
    apt-get --assume-yes install build-essential git python libfontconfig

    su vagrant -lc "
      set -e
      
      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
      echo 'source /home/vagrant/.nvm/nvm.sh' >> ~/.bashrc
      echo "'PS1=\\\\w$'" >> ~/.bashrc
      echo 'cd /vagrant' >> ~/.bashrc
      echo 'export DOTNET_USE_POLLING_FILE_WATCHER=true' >> ~/.profile
      echo 'unbind C-b' >> ~/.tmux.conf
      echo 'set -g prefix C-a' >> ~/.tmux.conf
      echo 'bind C-a send-prefix' >> ~/.tmux.conf

      source /home/vagrant/.nvm/nvm.sh
      nvm install $DEFAULT_NODE_VERSION
      nvm use $DEFAULT_NODE_VERSION

      npm install -g typings node-gyp@3.6.0 ttf2woff2@2.0.3 svgicons2svgfont@3.2.0 webpack rimraf

      # linking the node_modules folder to another location resolves several npm issues
      mkdir ~/node_modules
      cd /vagrant
      ln -s ~/node_modules node_modules
      npm install

      cd /vagrant/webapi
      dotnet restore
      dotnet publish
    "

    # install docker
    apt-get --assume-yes install linux-image-extra-$(uname -r) linux-image-extra-virtual docker-engine
    # Shibboleth Identity Provider image
    docker pull unicon/shibboleth-idp
    # Shibboleth Service Provider image
    docker pull unicon/shibboleth-sp
  SHELL
end
