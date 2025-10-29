const express = require('express');

const deviceController = require('./controllers/deviceController');

const HOST_IP = process.env.HOST_IP;
const PORT = process.env.PORT;

const server = express();
server.use('/devices', deviceController);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (_req, res) => {
  res.send('online');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Host LAN IP: ${HOST_IP}`);
  console.log(`Server → http://${HOST_IP}:${PORT}`);
});