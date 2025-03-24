const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute , followUnfollowUser);
router.get("/suggestedusers", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute , updateUser);

router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username || username.length < 3) {
      return res.status(400).json({ 
        error: "Username must be at least 3 characters long" 
      });
    }
    
    // Check if the username exists in the database
    const existingUser = await User.findOne({ username });
    
    return res.status(200).json({
      available: !existingUser
    });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
 