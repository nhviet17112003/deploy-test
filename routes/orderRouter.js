const express = require("express");
const bodyParser = require("body-parser");
const Order = require("../models/order");
const authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const orderRouter = express.Router();

orderRouter.use(bodyParser.json());

orderRouter.get(
  "/user",
  cors.cors,
  authenticate.verifyUser,
  (req, res, next) => {
    Order.find({ user: req.user._id })
      .populate("user", "fullname")
      .populate("order_details.book", "_id title author price imageurls")
      .then(
        (order) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

orderRouter.get(
  "/admin",
  cors.cors,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Order.find()
      .populate("user", "fullname phone address")
      .populate("order_details.book", "_id title author price imageurls")
      .then((order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      });
  }
);

//status update
orderRouter.post(
  "/status/:orderId",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Order.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: { status: req.body.status },
      },
      { new: true }
    )
      .then(
        (order) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

module.exports = orderRouter;