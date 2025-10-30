const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'CONTAINER';
const REQUIRED_FIELDS = ['user_id', 'name', 'permissions', 'image_tag', 'health_check_url', 'environment_variables', 'ports_mappings', 'volume_mappings'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const containerModel = {};
containerModel.findById = generateFindById(LABEL);
containerModel.findBy = generateFindBy(LABEL);
containerModel.findOneBy = generateFindOneBy(LABEL);
containerModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
containerModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = containerModel;