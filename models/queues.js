const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'DOCKER_SERVICE';
const REQUIRED_FIELDS = ['user_id', 'name', 'priority', 'type'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const queueModel = {};
queueModel.findById = generateFindById(LABEL);
queueModel.findBy = generateFindBy(LABEL);
queueModel.findOneBy = generateFindOneBy(LABEL);
queueModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
queueModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = queueModel;