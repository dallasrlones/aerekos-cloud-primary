// jwt
const UserModel = require('../models/users');
const jwt = require('jsonwebtoken');
const redisService = require('../services/db/redisService');

// auth middleware
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // check blacklist in redis
        const blacklisted = await redisService.read(`blacklist:${token}`);
        if (blacklisted) {
            return res.status(401).json({ message: 'Token revoked' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user; // attach user to request
        next();
    } catch (err) {
        // differentiate token expiry vs other errors if possible
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
    }
};

module.exports = authMiddleware;