const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user (Only Admin can register)
// @access  Private/Admin
router.post('/register', protect, admin, async (req, res) => {
    const { username, password, stationName, officerId } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            password,
            role: 'POLICE',
            stationName,
            officerId
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.json({ message: 'Officer registered successfully', user: { id: user.id, username: user.username, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user as Admin or Officer
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Check for Admin Credentials (from .env)
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const payload = {
            user: {
                id: 'admin_id_001',
                role: 'ADMIN',
                stationName: 'HEADQUARTERS'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                return res.json({
                    token,
                    user: {
                        id: 'admin_id_001',
                        username: 'Admin',
                        role: 'ADMIN',
                        stationName: 'HEADQUARTERS'
                    }
                });
            }
        );
        return;
    }

    // 2. Check for Database User (Officer)
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                stationName: user.stationName
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: user.role, stationName: user.stationName } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
