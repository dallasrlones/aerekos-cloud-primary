const { createClient } = require('redis');

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = process.env;

// Create Redis client
const client = createClient({
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  },
  password: REDIS_PASSWORD,
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down Redis client...');
  try {
    await client.quit();
  } catch (err) {
    console.error('Error during quit:', err);
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Connect with retry
async function connect() {
  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`));
  client.on('reconnecting', () => console.log('Reconnecting to Redis...'));

  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
}

// ===========================
// CRUD OPERATIONS
// ===========================

async function create(key, value, ttl = null) {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await client.set(key, stringValue, { EX: ttl });
    } else {
      await client.set(key, stringValue);
    }
    console.log(`Created: ${key}`);
    return { success: true, key };
  } catch (err) {
    console.error(`Create failed for ${key}:`, err);
    throw err;
  }
}

async function read(key) {
  try {
    const value = await client.get(key);
    if (value === null) {
      console.log(`Key not found: ${key}`);
      return null;
    }
    return JSON.parse(value);
  } catch (err) {
    console.error(`Read failed for ${key}:`, err);
    throw err;
  }
}

async function update(key, value, ttl = null) {
  return create(key, value, ttl); // Same as create
}

async function del(key) {
  try {
    const result = await client.del(key);
    console.log(`Deleted: ${key} (result: ${result})`);
    return result > 0;
  } catch (err) {
    console.error(`Delete failed for ${key}:`, err);
    throw err;
    }
}

async function list(pattern = '*') {
  try {
    const keys = await client.keys(pattern);
    const values = await Promise.all(
      keys.map(async (k) => ({
        key: k,
        value: await read(k),
      }))
    );
    return values;
  } catch (err) {
    console.error('List failed:', err);
    throw err;
  }
}

async function checkConnectionsAlive() {
  try {
    const pong = await client.ping();
    return pong === 'PONG';
  } catch (err) {
    console.error('Redis connection check failed:', err);
    return false;
  }
}

// Export as module
module.exports = {
  connect,
  checkConnectionsAlive,
  create,
  read,
  update,
  del,
  list,
  client,
};