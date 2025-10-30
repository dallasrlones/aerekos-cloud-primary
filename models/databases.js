const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'DATABASE';
const REQUIRED_FIELDS = ['user_id', 'name', 'device_id', 'permissions', 'database_storage_location', 'database_type', 'auth_object'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const databaseModel = {};
databaseModel.findById = generateFindById(LABEL);
databaseModel.findBy = generateFindBy(LABEL);
databaseModel.findOneBy = generateFindOneBy(LABEL);
databaseModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
databaseModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = databaseModel;