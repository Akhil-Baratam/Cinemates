const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const maxAge = 3 * 60 * 60 * 1000; // 3 hours
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge });

    res.cookie("jwt", token, {
        maxAge,
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
        sameSite: 'None', // Required for cross-site cookies
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost'
    });
};

module.exports = generateTokenAndSetCookie;
