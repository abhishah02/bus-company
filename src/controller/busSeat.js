const moment = require("moment");
const { v4 } = require("uuid");
const BusSeat = require("../modal/busSeat");

//You can create bus-seat with custom date duration
async function createBusSeat(req, res) {
  try {
    const { startDate, endDate, totalSeat } = req.body;

    var start = new Date(startDate);
    var end = new Date(endDate);

    const result = [];
    while (start <= end) {
      result.push(moment(start).format("YYYY-MM-DD"));
      start.setDate(start.getDate() + 1);
    }

    const createPromise = [];
    for (var x in result) {
      var availableSeat = [];
      for (let i = 1; i <= totalSeat; i++) {
        availableSeat.push(i);
      }
      var data = {
        bus_id: v4(),
        date: moment(result[x]).format("YYYY-MM-DD"),
        day: moment(result[x]).format("dddd"),
        total_seat: totalSeat,
        booked_seat: 0,
        available: availableSeat,
        unavailable: [],
      };

      createPromise.push(BusSeat.create(data));
      // await AllotSeat.create(data);
    }

    await Promise.all(createPromise);

    return res.json({
      st: true,
      msg: "Bus-Seat Successfully Created.",
    });
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//You can search bus by date
async function searchBus(req, res) {
  try {
    // const { date } = req.body;

    const viewBus = await BusSeat.findOne(
      { date: "2023-06-06" },
      {
        bus_id: 1,
        date: 1,
        day: 1,
        total_seat: 1,
        booked_seat: 1,
        unavailable: 1,
        available: 1,
      }
    );
    if (viewBus !== null) {
      return res.json({
        st: true,
        data: viewBus,
      });
    } else {
      return res.json({
        st: false,
        msg: "This Date has no bus available",
      });
    }
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

const busSeats = {
  createBusSeat,
  searchBus,
};

module.exports = busSeats;
