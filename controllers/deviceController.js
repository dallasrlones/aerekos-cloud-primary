// I want to make a router for device-related operations
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    const device = req.body.device;
    res.json({ device: device.ip });
});