const moment = require("moment");
const { v4 } = require("uuid");
const BusSeat = require("../modal/busSeat");

//You can create bus-seat with custom date duration
async function createBusSeat(req, res) {
  try {
    const { startDate, endDate, totalSeat } = req.body;

    const start = new Date(startDate);
    const updateStart = new Date(startDate);
    var end = new Date(endDate);

    if (end.getTime() > updateStart.setMonth(updateStart.getMonth() + 3)) {
      return res.json({
        st: false,
        msg: "Date will Created Between 3 Months.",
      });
    }

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

async function busList(req, res) {
  try {
    const { page, per_page } = req.body;

    const total_bus = await BusSeat.countDocuments();
    const list = await BusSeat.find(
      {},
      { bus_id: 1, date: 1, day: 1, total_seat: 1, booked_seat: 1 },
      { sort: "date" }
    )
      .limit(per_page * 1)
      .skip((page - 1) * per_page)
      .exec();
    return res.json({
      st: true,
      total_page: Math.ceil(total_bus / per_page),
      busList: list,
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
    const { date } = req.body;

    const viewBus = await BusSeat.findOne(
      { date: date },
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
      // console.log(viewBus.bus_id);
      res.cookie("busId", viewBus.bus_id);

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
  busList,
  searchBus,
};

module.exports = busSeats;
