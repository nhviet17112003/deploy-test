const express = require("express");
const bodyParser = require("body-parser");
const Cart = require("../models/cart");
const Book = require("../models/book");
const authenticate = require("../loaders/authenticate");
const cartRouter = express.Router();
const cors = require("../loaders/cors");
cartRouter.use(bodyParser.json());

cartRouter
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  //cart for user
  .get("/", cors.cors, authenticate.verifyUser, (req, res, next) => {
    Cart.find({ user: req.user._id })
      .populate("book", "_id title author price imageurls")
      .then(
        (cart) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cart);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  //total number of products in cart
  //   cartRouter.get("/total", cors.cors, authenticate.verifyUser, (req, res, next) => {
  //     Cart.aggregate([
  //         { $match: { user: req.user._id } },
  //         { $group: { _id: null, totalCount: { $sum: "$quantity" } } }
  //     ])
  //     .then((result) => {
  //         let totalCount = 0;
  //         if (result.length > 0) {
  //             totalCount = result[0].totalCount;
  //         }
  //         res.statusCode = 200;
  //         res.setHeader("Content-Type", "application/json");
  //         res.json({ totalCount });
  //     })
  //     .catch((err) => next(err));
  // })
  //all cart
  // .get("/allcart", (req, res, next) => {
  //   Cart.find({})
  //     .populate("user", "_id address phone email name")
  //     .populate("book", "_id title author price image")
  //     .then(
  //       (cart) => {
  //         res.statusCode = 200;
  //         res.setHeader("Content-Type", "application/json");
  //         res.json(cart);
  //       },
  //       (err) => next(err)
  //     )
  //     .catch((err) => next(err));
  // })
  //add product to cart

  .post(
    "/",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        let cart = await Cart.findOne({
          user: req.user._id,
          book: req.body.book,
        });
        // Check if there are enough books in stock
        const book = await Book.findById(req.body.book);
        if (book.quantity === 0) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Out of stock!" });
          return;
        } else if (book.quantity < req.body.quantity) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Not enough books in stock!" });
          return;
        }

        if (cart) {
          // If the book is already in the cart, update the quantity and total price
          cart.quantity += req.body.quantity;
          cart.total_price += req.body.price * req.body.quantity;
        } else {
          // If the book is not in the cart, create a new cart item
          cart = new Cart({
            user: req.user._id,
            book: req.body.book,
            price: req.body.price,
            quantity: req.body.quantity,
            total_price: req.body.price * req.body.quantity,
          });
        }
        await cart.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cart);
      } catch (err) {
        next(err);
      }
    }
  )
  //delete product from cart
  .delete(
    "/:cartId/product/:productId",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        //find cart item
        let cart = await Cart.findOne({
          user: req.user._id,
          book: req.params.productId,
        });
        if (!cart) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Product not found in cart!" });
          return;
        }
        //delete cart item
        await Cart.findOneAndDelete({
          user: req.user._id,
          book: req.params.productId,
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Product removed from cart!" });
      } catch (err) {
        next(err);
      }
    }
  )
  .delete(
    "/deleteCart",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        //find cart item
        let cart = await Cart.find({
          user: req.user._id,
        });
        if (!cart) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Cart not found!" });
          return;
        }
        //delete cart item
        Cart.deleteMany({ user: req.user._id })
          .then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ message: "Product removed from cart!" });
          })
          .catch((err) => next(err));
      } catch (err) {
        next(err);
      }
    }
  )
  .put(
    //increase quantity of product in cart
    "/increase/:cartId/product/:productId",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        //find cart item
        let cart = await Cart.findOne({
          user: req.user._id,
          book: req.params.productId,
        });
        if (!cart) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Product not found in cart!" });
          return;
        }
        // Check if there are enough books in stock
        const book = await Book.findById(req.params.productId);
        if (book.quantity === 0) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Out of stock!" });
          return;
        } else if (book.quantity < 1) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Not enough books in stock!" });
          return;
        }
        //update cart item
        cart.quantity += 1;
        cart.total_price += cart.price;
        await Book.findByIdAndUpdate(req.params.productId, {
          $inc: { quantity: -1 },
        });
        await cart.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cart);
      } catch (err) {
        next(err);
      }
    }
  )
  .put(
    //decrease quantity of product in cart
    "/decrease/:cartId/product/:productId",
    cors.corsWithOptions,
    authenticate.verifyUser,
    async (req, res, next) => {
      try {
        //find cart item
        let cart = await Cart.findOne({
          user: req.user._id,
          book: req.params.productId,
        });
        if (!cart) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Product not found in cart!" });
          return;
        }
        if (cart.quantity === 1) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json({ message: "Quantity cannot be less than 1!" });
          return;
        }
        //update cart item
        cart.quantity -= 1;
        cart.total_price -= cart.price;
        await Book.findByIdAndUpdate(req.params.productId, {
          $inc: { quantity: 1 },
        });
        await cart.save();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cart);
      } catch (err) {
        next(err);
      }
    }
  );

module.exports = cartRouter;
