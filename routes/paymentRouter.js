let express = require("express");
let paymentRouter = express.Router();
var Payment = require("../models/payment");
var Book = require("../models/book");
var Inventory = require("../models/inventory");
var Order = require("../models/order");
var authenticate = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const paypalConfig = require("../configs/paypalConfig");

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .route("/create_payment_paypal")
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    async function (req, res, next) {
      const { quantity, amount, order_details } = req.body;

      const fixNum = (num) => {
        return num.toFixed(2);
      };

      try {
        const listBook = await order_details.map((detail) => {
          return Book.findById(detail.book).exec();
        });
        const allDetail = await Promise.all(listBook);

        // Create items array with book details
        const items = order_details.map((detail, index) => {
          const book = allDetail[index];
          if (!book) {
            res.status(401).json({ message: "Book not found" });
          }
          return {
            name: book.title,
            sku: detail.book, // Using bookID as SKU
            price: book.price,
            currency: "USD",
            quantity: detail.order_quantity,
          };
        });

        const formattedAmount = fixNum(amount);

        console.log(items);

        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3000/api/payment/success",
            cancel_url: "http://localhost:3000/api/payment/cancel",
          },
          transactions: [
            {
              item_list: {
                items: items,
              },
              amount: {
                currency: "USD",
                total: formattedAmount,
              },
              description: "Best book store ever",
            },
          ],
        };

        console.log(fixNum);
        console.log(items);

        paypalConfig.payment.create(
          create_payment_json,
          async function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                  res.end(payment.links[i].href);
                  const token = payment.links[i].href.split("token=")[1];
                  console.log(token);

                  await Order.create({
                    user: req.user._id,
                    total_price: amount,
                    total_quantity: quantity,
                    paymentToken: token,
                    address: req.user.address,
                    phone: req.user.phone,
                    order_details: req.body.order_details.map((detail) => ({
                      book: detail.book,
                      order_quantity: detail.order_quantity,
                      order_price: detail.order_price,
                    })),
                  }).then(async (order) => {
                    await Payment.create({
                      paymentToken: token,
                      order: order._id,
                      user: req.user._id,
                      quantity: quantity,
                      total_price: amount,
                    });
                  });
                }
              }
            }
          }
        );
      } catch (err) {
        next(err);
      }
    }
  );

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/success", cors.cors, async function (req, res, next) {
    try {
      let paymentToken = req.query.token;

      console.log(paymentToken);

      const payment = Payment.findOne({ paymentToken: paymentToken });
      if (!payment) {
        res.status(401).json({ message: "Payment not found" });
      } else {
        await Payment.findOneAndUpdate(
          { paymentToken: paymentToken },
          { payment_status: "Success" }
        );

        const order = await Order.findOneAndUpdate(
          { paymentToken: paymentToken },
          { order_status: "Success" }
        );

        if (!order) {
          res.status(401).json({ message: "Order not found" });
        }

        for (let i of order.order_details) {
          try {
            await Inventory.create({
              book: i.book,
              quantity: i.order_quantity,
              transaction_type: "Sell",
            });

            // Update the quantity of the book
            await Book.findByIdAndUpdate(i.book, {
              $inc: { quantity: -i.order_quantity },
            });
          } catch (err) {
            next(err);
          }
        }

        res.status(200).redirect("http://localhost:3001/payment/success");
      }
    } catch (err) {
      next(err);
    }
  });

paymentRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get("/cancel", cors.cors, async function (req, res, next) {
    try {
      let paymentToken = req.query.token;

      console.log(paymentToken);

      const payment = Payment.findOne({ paymentToken: paymentToken });
      if (!payment) {
        res.status(401).json({ message: "Payment not found" });
      } else {
        await Payment.findOneAndUpdate(
          { paymentToken: paymentToken },
          { payment_status: "Cancel" }
        );

        const order = await Order.findOneAndUpdate(
          { paymentToken: paymentToken },
          { order_status: "Fail" }
        );

        if (!order) {
          res.status(401).json({ message: "Order not found" });
        }

        //tra sach ve kho
        // for (let detail of order.order_details) {
        //   await Book.findOneAndUpdate(
        //     { _id: detail.book },
        //     { $inc: { quantity: detail.order_quantity } }
        //   );
        // }
        console.log(order);
        res.status(200).redirect("http://localhost:3001/payment/cancel");
      }
    } catch (err) {
      next(err);
    }
  });

module.exports = paymentRouter;
