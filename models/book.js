const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookImageSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    defaultImg: {
      type: Boolean,
      default: false,
    },
  }
  // {
  //   timestamps: true,
  // }
);

var commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

var bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    total_rating: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    imageurls: [bookImageSchema],
    comments: [commentSchema],
    status: {
      type: Boolean,
      default: false
    },
  }
  // {
  //   timestamps: true,
  // }
);

var Books = mongoose.model("Books", bookSchema);
module.exports = Books;
