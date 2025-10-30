const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'BUCKET';
const REQUIRED_FIELDS = ['user_id', 'name', 'device_id', 'permissions', 'device_storage_location'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const bucketModel = {};
bucketModel.findById = generateFindById(LABEL);
bucketModel.findBy = generateFindBy(LABEL);
bucketModel.findOneBy = generateFindOneBy(LABEL);
bucketModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
bucketModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = bucketModel;