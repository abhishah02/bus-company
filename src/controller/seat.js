const { v4 } = require("uuid");
const moment = require("moment");
const Seat = require("../modal/seat");
const BusSeat = require("../modal/busSeat");

//This API will book your particular seat-number
async function bookSeat(req, res) {
  try {
    const { busId, name, email, seatNumber, dateOfBooking } = req.body;

    // var busId = req.body.busId;
    // if (busId === "") {
    //   busId = req.cookies.busId;
    // }
    const formateDate = moment(dateOfBooking).format("YYYY-MM-DD");

    const checkDate = await BusSeat.findOne({ date: formateDate });

    // console.log(checkDate);
    const checkSeatNumber = await Seat.findOne({
      bus_id: busId,
      dateOfBooking: formateDate,
      seat_number: seatNumber,
      isDelete: 0,
    });
    if (checkDate === null) {
      return res.json({
        st: false,
        msg: "This date as no bus.",
      });
    }

    if (parseInt(checkDate.booked_seat) > parseInt(checkDate.total_seat)) {
      return res.json({
        st: false,
        msg: "This Bus is Fully Booked.",
      });
    }

    if (checkSeatNumber !== null) {
      return res.json({ st: false, msg: "This seat is already booked." });
    }
    if (seatNumber > 0 && seatNumber <= 40) {
      await Seat.create({
        bus_id: busId,
        name: name,
        email: email,
        seat_number: seatNumber,
        dateOfBooking: formateDate,
        status: "close",
      });

      const addBook = parseInt(checkDate.booked_seat) + 1;

      // const availableSeat = checkDate.available;
      const unavailableSeat = checkDate.unavailable;

      // const availableSeatIndex = availableSeat.indexOf(seatNumber);
      // if (availableSeatIndex > -1) {
      //   // only splice array when item is found
      //   availableSeat.splice(availableSeatIndex, 1); // 2nd parameter means remove one item only
      // }
      unavailableSeat.push(seatNumber);

      await BusSeat.findOneAndUpdate(
        { bus_id: busId },
        {
          booked_seat: addBook,
          // available: availableSeat,
          unavailable: unavailableSeat,
        }
      );
      return res.json({ st: true, msg: "Seat Booked Successfully" });
    } else {
      return res.json({
        st: false,
        msg: "seat number must be less than 41 or greater then 0",
      });
    }
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//This API will find whether your seat is open or close
async function viewCloseOpenSeat(req, res) {
  try {
    const { busId, seatNumber, status } = req.body;

    if (busId === "" && seatNumber === null && status === "close") {
      const findSeatStatus = await Seat.find(
        { status: status },
        { status: 1, bus_id: 1, seat_number: 1 }
      );
      return res.json({
        st: true,
        data: findSeatStatus,
      });
    } else if (busId === "" && seatNumber === null && status === "open") {
      return res.status(404).json({
        st: false,
        msg: "No Seat Found!!!!!",
      });
    } else {
      const findSeatStatus = await Seat.findOne(
        { bus_id: busId, seat_number: seatNumber, status: status, isDelete: 0 },
        { status: 1, bus_id: 1, seat_number: 1 }
      );
      console.log(findSeatStatus);

      if (findSeatStatus === null) {
        return res.json({
          st: true,
          data: {
            status: "open",
            bus_id: busId,
            seat_number: seatNumber,
          },
        });
      } else {
        return res.json({
          st: true,
          data: findSeatStatus,
        });
      }
    }
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//This API will find your ticket status
async function viewStatus(req, res) {
  try {
    const { busId } = req.body;

    // if (busId === "" || seatNumber === null) {
    //   const findTicketStatus = await Seat.find(
    //     { isDelete: 0 },
    //     {
    //       bus_id: 1,
    //       name: 1,
    //       email: 1,
    //       seat_number: 1,
    //       dateOfBooking: 1,
    //       status: 1,
    //     }
    //   );
    //   return res.json({ st: true, data: findTicketStatus });
    // } else {
    const findTicketStatus = await Seat.find(
      { bus_id: busId, isDelete: 0 },
      {
        bus_id: 1,
        name: 1,
        email: 1,
        seat_number: 1,
        dateOfBooking: 1,
        status: 1,
      }
    );
    // if (findTicketStatus !== null) {
    return res.json({ st: true, data: findTicketStatus });
    // } else {
    //   return res.json({
    //     st: true,
    //     data: {
    //       status: "open",
    //       bus_id: busId,
    //       seat_number: seatNumber,
    //     },
    //   });
    // }
    // }
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//This API will show your seat details
async function viewSeatDetails(req, res) {
  try {
    const { busId, seatNumber } = req.body;

    const seatDetails = await Seat.findOne(
      { bus_id: busId, seat_number: seatNumber, isDelete: 0 },
      { seat_number: 1, name: 1, email: 1, dateOfBooking: 1, status: 1 }
    );
    if (seatDetails !== null) {
      return res.json({ st: true, data: seatDetails });
    } else {
      return res.json({ st: false, msg: "This seat is not booked." });
    }
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//This API will edit your seat details
async function editSeatDetails(req, res) {
  try {
    const { busId, seatNumber, name, email } = req.body;

    // const busId = req.cookies.busId;
    await Seat.findOneAndUpdate(
      { bus_id: busId, seat_number: seatNumber },
      { name: name, email: email }
    );

    return res.json({ st: true, msg: "Ticket Updated Successfully." });
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

//This API will delete your seat details
async function deleteSeatDetails(req, res) {
  try {
    const { busId, seatNumber } = req.body;

    // const busId = req.cookies.busId;
    await Seat.findOneAndUpdate(
      { bus_id: busId, seat_number: seatNumber },
      { isDelete: 1 }
    );

    return res.json({ st: true, msg: "This Ticket Deleted Successfully." });
  } catch (err) {
    return res.json({
      st: false,
      msg: err.message,
    });
  }
}

const seatDetails = {
  bookSeat,
  viewCloseOpenSeat,
  viewStatus,
  viewSeatDetails,
  editSeatDetails,
  deleteSeatDetails,
};

module.exports = seatDetails;
