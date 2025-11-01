const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('encryptedKeys', authMiddleware);
module.exports = router;