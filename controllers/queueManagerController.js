const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('queues', authMiddleware);
module.exports = router;