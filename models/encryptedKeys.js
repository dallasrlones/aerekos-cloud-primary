const { generateCrud } = require('../services/db/neo4jService');

const LABEL = 'ENCRYPTED_KEY';
const REQUIRED_FIELDS = ['user_id', 'name', 'value'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const encryptedKeysModel = generateCrud(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS, locked: LOCKED_FIELDS });

module.exports = encryptedKeysModel;