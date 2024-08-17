const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { createAd, deleteAd,  commentOnAd, interestedAd, getAllAds, getInterestedAds, getUserAds } = require('../controllers/adController');


const router = express.Router();

router.post("/create", protectRoute, createAd);
router.delete("/:id", protectRoute, deleteAd);
router.post("/interest/:id", protectRoute, interestedAd);
router.post("/comment/:id", protectRoute, commentOnAd);
router.get("/all", protectRoute, getAllAds);
router.get("/interested/:id", protectRoute, getInterestedAds);
router.get("/user/:username", protectRoute, getUserAds);
 

module.exports = router;