const { generateCrud } = require('../services/db/neo4jService');
const crypto = require('crypto');

const LABEL = 'DEVICE';
const REQUIRED_FIELDS = ['ip_address', 'name', 'token', 'services'];
const UNIQUE_FIELDS = ['token'];
const LOCKED_FIELDS = ['id'];

const beforeCreate = async (device) => {
  device.api_key = crypto.randomBytes(32).toString('hex');
  console.log('beforeCreate hook - device:', device);
  return device;
}
const deviceModel = generateCrud(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS, locked: LOCKED_FIELDS, before: beforeCreate });

module.exports = deviceModel;