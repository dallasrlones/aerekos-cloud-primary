const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'DOCKER_SERVICE';
const REQUIRED_FIELDS = ['user_id', 'name', 'value'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const dockerServiceModel = {};
dockerServiceModel.findById = generateFindById(LABEL);
dockerServiceModel.findBy = generateFindBy(LABEL);
dockerServiceModel.findOneBy = generateFindOneBy(LABEL);
dockerServiceModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
dockerServiceModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = dockerServiceModel;