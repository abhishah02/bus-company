const express = require("express");
const connectDb = require("./src/connection/db");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

//Connetion of Database
connectDb();

//Seat Router
const seatRoute = require("./src/router/seat");
app.use("/seat", seatRoute);

//Bus-Seat Router
const busSeatRoute = require("./src/router/busSeat");
app.use("/busSeat", busSeatRoute);


//You have to add PORT in the .env file 
//The application will listen to particular
app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
