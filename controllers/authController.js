// this is an express router
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const redisService = require('../services/db/redisService');

const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || '15m';
const REFRESH_TOKEN_EXP_SECONDS = Number(process.env.REFRESH_TOKEN_EXP_SECONDS || 60 * 60 * 24 * 7); // 7 days

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
}

function generateRefreshToken() {
    // simple random token — in production prefer secure opaque tokens (uuid or crypto.randomBytes)
    return require('crypto').randomBytes(48).toString('hex');
}

// register
router.post('/register', async (req, res) => {
    let { email, password } = req.body;
    if (email && typeof email === 'string') email = email.toLowerCase();
    try {
        const existingUser = await User.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await User.create({ email, password });
        if (newUser && newUser.id) {
            return res.status(201).json({ message: 'User created', userId: newUser.id });
        }
        return res.status(500).json({ message: 'Failed to create user' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// login
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    if (email && typeof email === 'string') email = email.toLowerCase();
    try {
        const user = await User.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isPasswordValid = await User.verifyPassword(user, password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // store refresh token in redis keyed by user id (allow multiple tokens per user if desired by using a set)
        await redisService.create(`refresh:${refreshToken}`, { userId: user.id }, REFRESH_TOKEN_EXP_SECONDS);

        res.json({ message: 'Login successful', accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// refresh access token
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' });

    try {
        const stored = await redisService.read(`refresh:${refreshToken}`);
        if (!stored || !stored.userId) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const user = await User.findById(stored.userId);
        if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// logout — invalidate refresh token and optionally blacklist access token
router.post('/logout', async (req, res) => {
    const { refreshToken, accessToken } = req.body;
    try {
        if (refreshToken) {
            await redisService.del(`refresh:${refreshToken}`);
        }

        if (accessToken) {
            // store blacklisted access token for its remaining TTL
            try {
                const decoded = jwt.decode(accessToken);
                if (decoded && decoded.exp) {
                    const now = Math.floor(Date.now() / 1000);
                    const ttl = decoded.exp - now;
                    if (ttl > 0) {
                        await redisService.create(`blacklist:${accessToken}`, { blacklisted: true }, ttl);
                    }
                }
            } catch (e) {
                // ignore decode errors
            }
        }

        res.json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// change password
router.post('/change-password', async (req, res) => {
    let { email, oldPassword, newPassword } = req.body;
    if (email && typeof email === 'string') email = email.toLowerCase();
    try {
        const user = await User.findOneBy({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isOldPasswordValid = await User.verifyPassword(user, oldPassword);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }
        const updated = await User.update(user.id, { password: newPassword });
        if (updated && updated.id) {
            // invalidate all refresh tokens for this user — optional: if tokens are stored by token, we can't enumerate; would need set
            // As a minimum we could set a password_changed_at timestamp on user and include it in JWT claims; skipping for now.
            return res.json({ message: 'Password changed successfully' });
        }
        res.status(500).json({ message: 'Failed to update password' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;