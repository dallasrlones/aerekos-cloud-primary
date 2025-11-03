const { generateCrud } = require('../services/db/neo4jService');
const crypto = require('crypto');
const LABEL = 'API_KEY';
const REQUIRED_FIELDS = ['user_id', 'api_key'];
const UNIQUE_FIELDS = ['api_key'];
const LOCKED_FIELDS = ['id'];

const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
  };
  
  const beforeCreate = async (attrs) => {
    attrs.api_key = await generateApiKey();
    return attrs;
  };


const apiKeyModel = generateCrud(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS, locked: LOCKED_FIELDS, before: beforeCreate });

module.exports = apiKeyModel;