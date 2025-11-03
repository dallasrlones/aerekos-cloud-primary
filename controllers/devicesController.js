const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('devices', authMiddleware);
const Device = require('../models/devices');
const ApiKey = require('../models/apiKeys');

router.post('/register', async (req, res) => {
    const { ip, name, api_key } = req.body;
    let foundKey = await ApiKey.findOneBy({ api_key: api_key });
    if (!foundKey) {
        return res.status(404).json({ error: 'Key Not Valid Or Expired' });
    }

    const foundDevice = await Device.findOneBy({ ip: ip });
    if (foundDevice) {
        return res.status(400).json({ error: 'Device IP Already Registered' });
    }

    const device = await Device.create({ ip, name, api_key });

    return res.json(device);
});

module.exports = router;