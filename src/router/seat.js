const express = require("express");
const router = express.Router();

const seatController = require("../controller/seat");

router.post("/bookSeat", seatController.bookSeat);
// router.get("/viewCloseSeat", seatController.viewCloseSeat);
// router.get("/viewOpenSeat", seatController.viewOpenSeat);
router.post("/viewCloseOpenSeat", seatController.viewCloseOpenSeat);
router.post("/viewStatus", seatController.viewStatus);
router.post("/viewSeatDetails", seatController.viewSeatDetails);
router.post("/editSeatDetails", seatController.editSeatDetails);
router.post("/deleteSeatDetails", seatController.deleteSeatDetails);

module.exports = router;
