const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { createCollab, deleteCollab,  commentOnCollab, interestedCollab, getAllCollabs, getInterestedCollabs, getUserCollabs } = require('../controllers/collabController');


const router = express.Router();

router.post("/create", protectRoute, createCollab);
router.delete("/:id", protectRoute, deleteCollab);
router.post("/interest/:id", protectRoute, interestedCollab);
router.post("/comment/:id", protectRoute, commentOnCollab);
router.get("/all", protectRoute, getAllCollabs);
router.get("/interested/:id", protectRoute, getInterestedCollabs);
router.get("/user/:username", protectRoute, getUserCollabs);
 

module.exports = router;