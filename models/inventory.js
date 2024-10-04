const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  quantity: {
    type: Number,
    required: true,
  },
  transaction_type: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
