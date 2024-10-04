var config = require("../configs/config");
const mongoose = require("mongoose");

const url = config.url;
const connect = mongoose.connect(url);
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);