const express = require('express');

const deviceController = require('./controllers/deviceController');
// psqlService checkConnectionAlive
const psqlService = require('./services/db/psqlService');
const redisService = require('./services/db/redisService');

const HOST_IP = process.env.HOST_IP;
const PORT = process.env.PORT;

const server = express();
server.use('/devices', deviceController);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (_req, res) => {
  res.send('online');
});

const checkConnectionsAlive = async () => {
  const redisAlive = await redisService.checkConnectionsAlive();
  const psqlAlive = await psqlService.checkConnectionsAlive();

  return redisAlive && psqlAlive;
};

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`Host LAN IP: ${HOST_IP}`);
  console.log(`Server → http://${HOST_IP}:${PORT}`);
  const connectionsAlive = await checkConnectionsAlive();
  if (connectionsAlive) {
    console.log('All connections are alive.');
  } else {
    console.log('Some connections are down. Please check the logs.');
    process.exit(1);
  }
});