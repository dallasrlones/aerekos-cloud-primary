const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'FILE';
const REQUIRED_FIELDS = ['user_id', 'name', 'device_id', 'permissions', 'file_location', 'file_size', 'file_type', 'bucket_id'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const fileModel = {};
fileModel.findById = generateFindById(LABEL);
fileModel.findBy = generateFindBy(LABEL);
fileModel.findOneBy = generateFindOneBy(LABEL);
fileModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
fileModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = fileModel;