const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'LOG';
const REQUIRED_FIELDS = ['user_id', 'name', 'service_id', 'value'];
const UNIQUE_FIELDS = [];
const LOCKED_FIELDS = ['id'];

const logModel = {};
logModel.findById = generateFindById(LABEL);
logModel.findBy = generateFindBy(LABEL);
logModel.findOneBy = generateFindOneBy(LABEL);
logModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
logModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = logModel;