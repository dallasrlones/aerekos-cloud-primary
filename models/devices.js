const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'DEVICE';
const REQUIRED_FIELDS = ['ip_address', 'name', 'token'];
const UNIQUE_FIELDS = ['token'];
const LOCKED_FIELDS = ['id'];

const deviceModel = {};
deviceModel.findById = generateFindById(LABEL);
deviceModel.findBy = generateFindBy(LABEL);
deviceModel.findOneBy = generateFindOneBy(LABEL);
deviceModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
deviceModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = deviceModel;