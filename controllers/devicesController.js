const generateCRUDRoutes = require('./helpers/crudHelper.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = generateCRUDRoutes('devices', authMiddleware);
const Device = require('../models/devices');
const ApiKey = require('../models/apiKeys');
const { randomUUID } = require('node:crypto');

router.post('/register', async (req, res) => {
    const { ip, name, api_key, specs } = req.body;

    let foundKey = await ApiKey.findOneBy({ api_key: api_key });
    if (!foundKey) {
        return res.status(404).json({ error: 'Key Not Valid Or Expired' });
    }

    const foundDevice = await Device.findOneBy({ ip: ip });
    if (foundDevice) {
       return res.status(400).json({ error: 'Device IP Already Registered' });
    }

    // Create new device with specs
    const devicePayload = { 
        ip, 
        name: `${name}-${randomUUID()}`, 
        api_key,
        ...specs,
        last_seen: new Date().toISOString(),
        user_id: foundKey.user_id
    };
    devicePayload.cpu_model = specs.cpu.model;
    devicePayload.cpu_cores = specs.cpu.cores;
    delete devicePayload.cpu;
    const device = await Device.create(devicePayload);

    return res.json({ 
        message: 'Device registered successfully',
        device 
    });
});

module.exports = router;