const { generateCrud } = require('../services/db/neo4jService');

const LABEL = 'STORAGE';
const REQUIRED_FIELDS = ['name'];
const UNIQUE_FIELDS = [];
const LOCKED_FIELDS = ['id'];

// Hook to process device_ids before saving (used for both create and update)
const before = async (data) => {
  // Convert array to comma-separated string if it's an array
  if (Array.isArray(data.device_ids)) {
    data.device_ids = data.device_ids.join(',');
  }
  return data;
};

const storageModel = generateCrud(LABEL, { 
  required: REQUIRED_FIELDS, 
  unique: UNIQUE_FIELDS, 
  locked: LOCKED_FIELDS,
  before: before
});

module.exports = storageModel;

