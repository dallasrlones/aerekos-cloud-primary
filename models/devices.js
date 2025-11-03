const { generateCrud } = require('../services/db/neo4jService');
const crypto = require('crypto');

const LABEL = 'DEVICE';
const REQUIRED_FIELDS = ['ip_address', 'name'];
const UNIQUE_FIELDS = ['ip_address'];
const LOCKED_FIELDS = ['id'];

const deviceModel = generateCrud(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS, locked: LOCKED_FIELDS });

module.exports = deviceModel;