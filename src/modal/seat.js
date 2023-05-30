const mongoose = require("mongoose");

//This schema will be automatically created in your database with the collection name of seats
const SeatSchema = new mongoose.Schema(
  {
    bus_id: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    seat_number: { type: Number, require: true },
    dateOfBooking: { type: Date },
    status: { type: String, require: true },
    isDelete: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Seat = mongoose.model("seat", SeatSchema);

module.exports = Seat;
