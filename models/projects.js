const { generateCrud } = require('../services/db/neo4jService');

const LABEL = 'PROJECT';
const REQUIRED_FIELDS = ['user_id', 'name'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const projectModel = generateCrud(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS, locked: LOCKED_FIELDS });

module.exports = projectModel;