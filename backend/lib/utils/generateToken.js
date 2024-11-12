const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const maxAge = 3 * 60 * 60 * 1000; // Set token expiration time
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: maxAge });

    res.cookie("jwt", token, {
        maxAge, // 1 day in milliseconds, matching expiresIn
        secure: true,
        sameSite: "None",
    });
};

module.exports = generateTokenAndSetCookie;
