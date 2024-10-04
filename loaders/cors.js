const express = require("express");
const cors = require("cors");
const app = express();

//whitelist: danh sách các domain có thể truy cập server
const whitelist = [
  
  "http://localhost:3001",
  "https://localhost:3443",
  "http://localhost:3000",
 
  
];

//corsOptionsDelegate: hàm kiểm tra xem origin có trong whitelist không
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  const origin = req.header("Origin");

  if (origin && whitelist.indexOf(origin) !== -1) {
    // nếu origin có trong whitelist
    corsOptions = { origin: true }; // cho phép truy cập
  } else {
    corsOptions = { origin: false }; // không cho phép truy cập
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
