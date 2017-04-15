# NOTE: the windows user invoking vagrant for the first provisioning of this box requires the permission to create 
# windows symlinks. so either first time invoke "vagrant up" as admin or give your current user the proper permission!

# All Vagrant configuration is done below. The "2" in Vagrant.configure configures the configuration version 
# (we support older styles for backwards compatibility). Please don't change it unless you know what you're doing.
Vagrant.configure("2") do |config|
  # Configuration options reference: https://www.vagrantup.com/docs/vagrantfile/machine_settings.html

  # note: do not use the "official" ubuntu box (ubuntu/xenial64) as several issues have been reported regarding it.
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.box_check_update = false

  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1", protocol: "tcp"

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    #vb.gui = true

    # Customize the amount of memory on the VM:
    vb.memory = "256"
  end

  config.vm.provision "shell", inline: <<-SHELL
    declare -r DEFAULT_NODE_VERSION=7.8.0
    set -e

    apt-get update
    apt-get install -y build-essential git python libfontconfig nano

    su vagrant -lc "
      set -e
      
      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
      echo 'source /home/vagrant/.nvm/nvm.sh' >> ~/.bashrc
      # echo "'PS1="\e[1;36m\\w\e[1;35m\$ \e[0;00m"'" >> ~/.bashrc
      echo "'PS1=\\w$'" >> ~/.bashrc
      echo 'cd /vagrant' >> ~/.bashrc

      source /home/vagrant/.nvm/nvm.sh
      nvm install $DEFAULT_NODE_VERSION
      nvm use $DEFAULT_NODE_VERSION

      npm install -g typings node-gyp@3.6.0 ttf2woff2@2.0.3 svgicons2svgfont@3.2.0 webpack rimraf

      # linking the node_modules folder to another location resolves several npm issues
      mkdir ~/node_modules
      cd /vagrant
      ln -s ~/node_modules node_modules
      npm install
    "
  SHELL
end
