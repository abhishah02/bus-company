const mongoose = require("mongoose");

//This schema will be automatically created in your database with the collection name of bus-seats
const BusSchema = new mongoose.Schema(
  {
    bus_id: { type: String, require: true },
    date: { type: Date, require: true },
    day: { type: String, require: true },
    total_seat: { type: Number, require: true },
    booked_seat: { type: Number, default: 0, require: true },
    available: { type: [Number] },
    unavailable: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  }
);

const BusSeat = mongoose.model("bus-seat", BusSchema);

module.exports = BusSeat;
