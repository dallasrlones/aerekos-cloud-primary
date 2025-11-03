const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('devices', authMiddleware);
const Device = require('../models/devices');

router.post('/register', async (req, res) => {
    let device = await Device.findOneBy({ api_key: req.body.api_key });
    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    if (device.ip !== req.body.ip) {
        device = await Device.update(device.id, { ip: req.body.ip });
    }

    return res.json(device);
});

module.exports = router;