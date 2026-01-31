const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        // For Development ease, sometimes we skip, but better to enforce
        // return next(); 
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1] || token;

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
