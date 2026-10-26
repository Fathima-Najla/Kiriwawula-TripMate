const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            "KIRIWAWULA_SECRET_KEY"
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};


// Admin authorization
const adminMiddleware = (req, res, next) => {

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only."
        });
    }

    next();
};


module.exports = {
    authMiddleware,
    adminMiddleware
};