cd /home/super-fastify-backend
pm2 stop pm2.config.js
pm2 delete pm2.config.js
git pull
rm -rf node_modules package-lock.json
npm install
pm2 start pm2.config.js
pm2 save
