const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'SCHEDULER';
const REQUIRED_FIELDS = ['user_id', 'name', 'worker_id', 'cron_expression'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const scheduleModel = {};
scheduleModel.findById = generateFindById(LABEL);
scheduleModel.findBy = generateFindBy(LABEL);
scheduleModel.findOneBy = generateFindOneBy(LABEL);
scheduleModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
scheduleModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = scheduleModel;