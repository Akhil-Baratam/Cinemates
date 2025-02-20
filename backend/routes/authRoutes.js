const express = require('express');
const { signup, login, logout, getMe, onboarding } = require('../controllers/authController');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.get("/onboarding", protectRoute, onboarding);

module.exports = router; 