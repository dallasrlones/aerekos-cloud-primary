const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'LOAD_BALANCER';
const REQUIRED_FIELDS = ['user_id', 'name', 'permissions', 'load_balancer_configuration'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

const loadBalancerModel = {};
loadBalancerModel.findById = generateFindById(LABEL);
loadBalancerModel.findBy = generateFindBy(LABEL);
loadBalancerModel.findOneBy = generateFindOneBy(LABEL);
loadBalancerModel.create = generateCreate(LABEL, { required: REQUIRED_FIELDS, unique: UNIQUE_FIELDS });
loadBalancerModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS });

module.exports = loadBalancerModel;