const express = require("express");
const router = express.Router();

const busSeatController = require('../controller/busSeat')

router.post("/createBusSeat",busSeatController.createBusSeat);
router.get("/searchBus", busSeatController.searchBus);

module.exports = router