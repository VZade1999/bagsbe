const express = require("express");
const router = express.Router();
const userMngtController = require("../controller/userMngtController");
const roomBookingController = require("../controller/roomBookingController");
const auth = require("../middleware/aut")


router.post("/register", userMngtController.registerUser);

router.post('/generateotp', userMngtController.generateOtp );

router.post("/login", userMngtController.loginUser);

router.post("/roomcheck", roomBookingController.roomCheck);

router.post("/roombooking", auth.validateAuth, roomBookingController.roomBooking);

router.post("/roombooked", auth.validateAuth, roomBookingController.roombooked);

module.exports = router;
