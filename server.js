const express = require('express');

const deviceController = require('./controllers/deviceController');
// psqlService checkConnectionAlive
const neo4jService = require('./services/db/neo4jService');
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
  const neo4jAlive = await neo4jService.checkConnectionsAlive();

  return redisAlive && neo4jAlive;
};

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`Host LAN IP: ${HOST_IP}`);
  console.log(`Server \u2192 http://${HOST_IP}:${PORT}`);

  // Ensure services establish connections before health check
  try {
    await redisService.connect();
  } catch (err) {
    console.error('Redis failed to connect during startup:', err);
    process.exit(1);
  }

  const connectionsAlive = await checkConnectionsAlive();
  if (connectionsAlive) {
    console.log('All connections are alive.');
  } else {
    console.log('Some connections are down. Please check the logs.');
    process.exit(1);
  }
});