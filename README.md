# Seed Viewer

A simple NodeJS based app with an EJS frontend built as part of the participation in the [#growlab](https://github.com/alexellis/growlab) contest.

## How to install

This assumes you have [phototimer](https://github.com/alexellis/phototimer) setup and running on the same device.
It is recommended to use pm2 to keep this app running. 
These steps are based on using a Raspberry Pi Zero. 

```bash
#Install updates and Git
sudo apt update && sudo apt upgrade -qy
sudo apt install git -qy
#Create required directories and set permissions (adjust if necessary)
sudo mkdir /seed
sudo mkdir /seed/app
sudo chmod 777 /seed -R
#Install node 
cd /seed/app
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v14.10.0.sh | bash
node --version
#Install pm2
sudo npm install -g pm2
pm2 status
#If command fails, run `whereis pm2` and add the directory to PATH (e.g. `export PATH=$PATH:/opt/nodejs/bin/ && source ~/.bashrc`)
#Download and install app
cd /seed/app/
sudo git clone https://github.com/sam-perrin/seed-viewer
cd /seed/app/seed-viewer
sudo npm install
```

## Run the app

The app requires an environment variable `IMG_DIR` to be set. 
This is the directory that [phototimer](https://github.com/alexellis/phototimer) is outputting images to. 
In my case this was `/seed/images`.

```bash
IMG_DIR=/seed/images pm2 start /seed/app/seed-viewer/index.js --name seed-viewer
pm2 status
#You should see an entry named "seed-viewer" with the status of "running"
```

To enable this app to autostart on device reboot, run the following
```bash
pm2 startup
#Follow the directions outputted to setup pm2 startup
pm2 save
```






