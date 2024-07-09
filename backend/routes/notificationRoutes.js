const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getNotifications, deleteNotifications } = require('../controllers/notificationController');


const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);



module.exports = router;