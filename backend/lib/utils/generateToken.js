const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const maxAge = 3 * 60 * 60 * 1000; // 3 hours
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
    
    res.cookie("jwt", token, {
        maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    });
};

module.exports = generateTokenAndSetCookie;
