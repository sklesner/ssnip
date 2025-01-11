# as root
sudo apt-get update 
sudo curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get update
sudo apt install nodejs

# as user
npm install wrangler --save-dev