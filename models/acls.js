const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'ACL';
const REQUIRED_FIELDS = ['user_id', 'name', 'service_id', 'permissions'];
const UNIQUE_FIELDS = [];
const LOCKED_FIELDS = ['id'];

const aclModel = {};
aclModel.findById = generateFindById(LABEL);
aclModel.findBy = generateFindBy(LABEL);
aclModel.findOneBy = generateFindOneBy(LABEL);
aclModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
aclModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = aclModel;