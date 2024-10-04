const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var orderDetailSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
  },
  order_quantity: {
    type: Number,
    required: true,
  },
  order_price: {
    type: Number,
    required: true,
  },
});

var orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  paymentToken: {
    type: String,
    required: true,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  order_status: {
    type: String,
    default: "Waiting", //waiting là chờ xác nhận
  },
  order_details: [orderDetailSchema],
});

var Order = mongoose.model("Order", orderSchema);
module.exports = Order;
