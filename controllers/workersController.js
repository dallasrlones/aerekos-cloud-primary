const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('workers', authMiddleware);
module.exports = router;