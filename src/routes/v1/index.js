const express = require("express");
const router = express.Router();

const { BookingController } = require("../../controllers/index");
const bookingController = new BookingController();

router.post("/bookings", bookingController.create);
router.post("/publish", bookingController.sendMessagetoQueue);
module.exports = router;
