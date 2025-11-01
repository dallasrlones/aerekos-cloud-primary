const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('projects', authMiddleware);

router.post('/register', (req, res) => {
    console.log(req.body)
    // const device = req.body.device;
    // res.json({ device: device.ip });
    res.json({ status: 'Device registered successfully' });
});

module.exports = router;