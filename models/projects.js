const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'DOCKER_SERVICE';
const REQUIRED_FIELDS = ['user_id', 'name'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const projectModel = {};
projectModel.findById = generateFindById(LABEL);
projectModel.findBy = generateFindBy(LABEL);
projectModel.findOneBy = generateFindOneBy(LABEL);
projectModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
projectModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = projectModel;