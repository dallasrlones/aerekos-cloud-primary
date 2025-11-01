const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('loadBalancers', authMiddleware);
module.exports = router;