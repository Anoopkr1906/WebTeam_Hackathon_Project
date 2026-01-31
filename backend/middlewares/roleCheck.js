module.exports = function (roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access Denied: Requires one of the following roles: [${roles.join(', ')}]`
            });
        }
        next();
    };
};
