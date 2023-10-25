# MERN Stack Project Deployment on Azure Virtual Machine

This guide will walk you through the steps to deploy a MERN (MongoDB, Express.js, React, Node.js) stack project on a virtual machine (VM) in Microsoft Azure.


## Prerequisites

Before you begin, make sure you have the following:

-   An Azure VM ready to deploy your project.
-   Your SSH key (`Amr006_key.pem`) to access the VM.
-   Basic knowledge of Linux terminal commands.


## Step 1: Move SSH Key to VM

First, move your SSH key to the appropriate location on your VM.

	mv C:\Users\10\Desktop\Amr006_key.pem ~\.ssh\`

Ensure the key has proper permissions:

	icacls "C:\Users\10\.ssh\Amr006_key.pem" /inheritance:r /grant:r "%USERNAME%:R"
	or
	chmod 400 Amr006_key.pem 

## Step 2: Update and Install Nginx

	sudo apt update && sudo apt upgrade -y
	sudo apt-get install nginx -y
	sudo systemctl enable nginx
	sudo systemctl status nginx


## Step 3: Configure Nginx

Create and edit an Nginx configuration file:

	cd /etc/nginx/sites-available/
	sudo cp default myserver
	sudo vim myserver
Inside the file, configure Nginx for your project:

	server {
	    listen 80;
	    listen [::]:80;
	    root /home/azureuser/apps/my-notes-app/client/build;
	    index index.html index.htm index.nginx-debian.html;
	    server_name 20.51.228.239;

	    location / {
	        try_files $uri /index.html;
	    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
	}
Save and exit the Vim editor using `:wq` and `:qa`.
Create a symbolic link to enable your configuration:

	sudo ln -s /etc/nginx/sites-available/myserver /etc/nginx/sites-enabled/

Restart Nginx after any changes:

	sudo service nginx restart
## Step 4: Install NVM and Node.js
Install NVM (Node Version Manager) and Node.js:

	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
	exit  # Close and reopen your terminal or reconnect.
	ssh -i C:\Users\10\.ssh\Amr006_key.pem azureuser@20.46.54.15
	nvm install 19.8.1  # or your desired Node.js version
	node -v



## Step 5: Install PM2 and MongoDB

Install PM2 globally and MongoDB:

	npm install pm2 --location=global

For MongoDB, follow these steps:
	
	wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add
	echo "deb [arch=amd64,arm64] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
	sudo systemctl start mongod
	sudo systemctl enable mongod.service
	sudo chown -R mongodb:mongodb /var/lib/mongodb
	sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
	sudo service mongod restart


## Step 6: Copy Your Project

	scp -i C:\Users\10\.ssh\Amr006_key.pem -r .\YourMERNProject\ azureuser@20.174.9.91:/home/azureuser

## Step 7: Start and Configure PM2

Start your Node.js server using PM2:

	pm2 start server.js -i max
	pm2 startup

Follow the provided command to configure PM2 for startup and save the configuration:

	pm2 save


## Step 8: MongoDB Data Migration

To migrate MongoDB data, use MongoDB Compass to export data in JSON format and then import it into your VM:

	mongoimport --db BrainStorm --collection tournaments --file tournaments.json --jsonArray --username <your_username> --password <your_password>



## Conclusion

Your MERN stack project is now deployed on an Azure VM with Nginx, Node.js, PM2, and MongoDB. You can access it via the VM's IP address. Enjoy your deployment!

Feel free to reach out if you have any questions or need further assistance.

**Author:** Amr006
**Role:** Software Engineer | Backend Developer | Node.js


```