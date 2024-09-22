#!/bin/bash
export PATH =$PATH:/home/ubuntu/.nvm/versions/node/v22.9.0/bin

cd chat-nodejs
git pull origin main
pm2 kill
pm2 start dist/index.js