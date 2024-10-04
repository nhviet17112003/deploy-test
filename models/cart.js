const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
});

var Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
