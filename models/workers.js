const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'WORKER';
const REQUIRED_FIELDS = ['user_id', 'name', 'queue_name', 'worker_volume_location', 'worker_file_locatiton'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const workerModel = {};
workerModel.findById = generateFindById(LABEL);
workerModel.findBy = generateFindBy(LABEL);
workerModel.findOneBy = generateFindOneBy(LABEL);
workerModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
workerModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = workerModel;