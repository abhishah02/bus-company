const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./src/connection/db");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json());

//Seat Router
const seatRoute = require("./src/router/seat");
app.use("/seat", seatRoute);

//Bus-Seat Router
const busSeatRoute = require("./src/router/busSeat");
app.use("/busSeat", busSeatRoute);

//You have to add PORT in the .env file
const server = () => {
  //Connetion of Database
  connectDb();

  //The application will listen to particular
  app.listen(PORT, () => {
    console.log(`Server is ruuning on port ${PORT}`);
  });
};

server();
