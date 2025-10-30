const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'CDN';
const REQUIRED_FIELDS = ['user_id', 'name', 'device_id', 'permissions', 'cdn_storage_location'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const cdnModel = {};
cdnModel.findById = generateFindById(LABEL);
cdnModel.findBy = generateFindBy(LABEL);
cdnModel.findOneBy = generateFindOneBy(LABEL);
cdnModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
cdnModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = cdnModel;