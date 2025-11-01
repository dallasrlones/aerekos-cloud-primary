const express = require('express');
const authController = require('./controllers/authController');
// psqlService checkConnectionAlive
const neo4jService = require('./services/db/neo4jService');
const redisService = require('./services/db/redisService');

const HOST_IP = process.env.HOST_IP;
const PORT = process.env.PORT;

const server = express();
// parse JSON bodies before route handlers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const corsMiddleware = (req, res, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // respond to preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

server.use(corsMiddleware);

// mount auth routes
// server.use('/auth', authController);

// find all the controllers in ./controllers and server.use them based on their file name
const fs = require('fs');
const path = require('path');

const controllersPath = path.join(__dirname, 'controllers');
fs.readdirSync(controllersPath).forEach((file) => {
  if (file === 'authController.js') return; // already mounted
  if (file.endsWith('Controller.js')) {
    const route = `/${file.replace('Controller.js', '')}`;
    console.log(`Mounting controller for route: ${route}`);
    const controller = require(path.join(controllersPath, file));
    server.use(route, controller);
  }
});

// health check endpoint

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