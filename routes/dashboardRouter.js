const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const dashboardRouter = express.Router();
const Order = require("../models/order");

dashboardRouter.use(bodyParser.json());

//doanh thu ngày
dashboardRouter
  .get(
    "/daily-revenue",
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      let startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      let endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      Order.aggregate([
        {
          $match: {
            order_date: { $gte: startOfDay, $lt: endOfDay },
            order_status: "Success",
          },
        },
        {
          $group: {
            _id: null,
            daily_revenue: { $sum: "$total_price" },
          },
        },
      ])
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => next(err));
    }
  )
  .get(
    "/monthly-revenue",
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      let startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      let endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      Order.aggregate([
        {
          $match: {
            order_date: { $gte: startOfMonth, $lt: endOfMonth },
            order_status: "Success",
          },
        },
        {
          $group: {
            _id: null,
            monthly_revenue: { $sum: "$total_price" },
          },
        },
      ])
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => next(err));
    }
  )
  .get(
    "/yearly-revenue",
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      let startOfYear = new Date();
      startOfYear.setMonth(0);
      startOfYear.setDate(1);
      startOfYear.setHours(0, 0, 0, 0);

      let endOfYear = new Date();
      endOfYear.setMonth(11);
      endOfYear.setDate(31);
      endOfYear.setHours(23, 59, 59, 999);

      Order.aggregate([
        {
          $match: {
            order_date: { $gte: startOfYear, $lt: endOfYear },
            order_status: "Success",
          },
        },
        {
          $group: {
            _id: null,
            yearly_revenue: { $sum: "$total_price" },
          },
        },
      ])
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => next(err));
    }
  );
//Total quantity of books sold
dashboardRouter
  .get(
    "/total-quantity",
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Order.aggregate([
        { $unwind: "$order_details" }, //unwind để giải nén mảng, mỗi phần tử trong mảng sẽ tạo ra một bản ghi mới
        { $match: { order_status: "Success" } },
        {
          $group: {
            _id: null,
            total_quantity: { $sum: "$order_details.order_quantity" },
          },
        },
      ])
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => next(err));
    }
  )
  .get(
    "/revenue/:month",
    //Show revenue by month
    cors.cors,
    (req, res, next) => {
      let startOfMonth = new Date(req.params.month);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      let endOfMonth = new Date(req.params.month);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      Order.aggregate([
        {
          $match: {
            order_date: { $gte: startOfMonth, $lt: endOfMonth },
            order_status: "Success",
          },
        },
        {
          $group: {
            _id: null,
            revenue_by_month: { $sum: "$total_price" },
          },
        },
      ])
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        })
        .catch((err) => next(err));
    }
  );

module.exports = dashboardRouter;
