const mongoose = require("mongoose");
require("dotenv").config();
const env = process.env;

//You have to add MONGODB_URI & DB_NAME in the .env file
const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.DB_NAME;
const mongodb = MONGODB_URI + DB_NAME;

//This will connect to your mongoDB
const connectDb = () => {
  return mongoose
    .connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected"))
    .catch((err) => console.error("Error : ", err));
};

module.exports = connectDb;
