const { generateCrud } = require('../services/db/neo4jService');

const LABEL = 'AEREKOS_SERVICE';
const REQUIRED_FIELDS = ['type', 'description'];
const UNIQUE_FIELDS = ['name'];
const LOCKED_FIELDS = ['id'];

// Service types - like AWS services
const SERVICE_TYPES = [
  'storage',        // Like S3 - object storage
  'cdn',            // Like CloudFront - content delivery
  'database',       // Like RDS - relational database
  'cache',          // Like ElastiCache - caching
  'queue',          // Like SQS - message queue
  'compute',        // Like EC2 - virtual machines
  'container',      // Like ECS - container orchestration
  'serverless',     // Like Lambda - serverless functions
  'loadbalancer',   // Like ELB - load balancing
  'dns',            // Like Route53 - DNS management
  'monitoring',     // Like CloudWatch - monitoring
  'logging',        // Like CloudTrail - logging
  'secrets',        // Like Secrets Manager - secret storage
  'registry'        // Like ECR - container registry
];

// Before hook to auto-generate name from type
const beforeCreate = async (service) => {
  // Auto-generate name from type with dashes instead of underscores
  service.name = service.type.replace(/_/g, '-');
  console.log('Auto-generated service name:', service.name);
  return service;
};

const beforeUpdate = async (service) => {
  // If type changed, update name
  if (service.type) {
    service.name = service.type.replace(/_/g, '-');
    console.log('Updated service name:', service.name);
  }
  return service;
};

const aerekosServiceModel = generateCrud(LABEL, { 
  required: REQUIRED_FIELDS, 
  unique: UNIQUE_FIELDS, 
  locked: LOCKED_FIELDS,
  before: beforeCreate
});

// Override update to also use beforeUpdate
const originalUpdate = aerekosServiceModel.update;
aerekosServiceModel.update = async (id, updateObj) => {
  const processedObj = await beforeUpdate(updateObj);
  return originalUpdate(id, processedObj);
};

module.exports = aerekosServiceModel;
module.exports.SERVICE_TYPES = SERVICE_TYPES;