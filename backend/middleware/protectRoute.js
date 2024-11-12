const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // Verify the token and handle potential expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Find the user associated with the token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Set user info in the request object
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log("Error: Token has expired", err.message);
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }
        
        console.log("Error in protectRoute middleware", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = protectRoute;
