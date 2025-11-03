const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('aerekosServices', authMiddleware);
const AerekosService = require('../models/aerekosServices');

module.exports = router;