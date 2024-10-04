require("dotenv").config(); // Load biến môi trường từ file .env

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRouter");
var bookRouter = require("./routes/bookRouter");
var paymentRouter = require("./routes/paymentRouter");
var uploadRouter = require("./routes/uploadRouter");
var cartRouter = require("./routes/cartRouter");
var orderRouter = require("./routes/orderRouter");
var dashboardRouter = require("./routes/dashboardRouter");
var cors = require("cors");
var session = require("./loaders/session");

const connect = require("./loaders/mongoose");

var app = express();
//connect to the database
app.connect = connect;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/books", bookRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/cart", cartRouter);
app.use("/api/dashboard", dashboardRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
