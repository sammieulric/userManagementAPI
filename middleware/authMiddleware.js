const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to the request
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password"] }
            });

            if (!req.user) {
                console.log("❌ Token is valid, but user not found in DB");
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.log("❌ Invalid token:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Middleware to restrict routes to admins only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { protect, adminOnly };
