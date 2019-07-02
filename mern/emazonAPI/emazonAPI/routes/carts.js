var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("carts");
  collection.find({}, {}, function(err, carts) {
    res.json(carts);
  });
});

router.get("/:userId", function(req, res, next) {
  const db = req.db;
  const collection = db.get("carts");
  const userId = req.params.userId;

  collection.findOne({ userId: userId }, {}, function(err, cart) {
    res.send(err === null ? cart : err);
  });
});

router.post("/:userId", function(req, res, next) {
  const db = req.db;
  const collection = db.get("carts");
  const book = req.body.book;
  const userId = req.params.userId;
  collection.findOne({ userId: userId }, {}, function(err, result) {
    if (result) {
      const books = [...result.books, book];
      const cart = { ...result, books: books };
      collection.update(
        { _id: cart._id },
        { $set: { books: cart.books } },
        function(error, foundedCart) {
          res.send(error === null ? foundedCart : error);
        }
      );
    } else {
      const cart = {
        userId: userId,
        books: [book]
      };
      collection.insert(cart, {}, function(error, newCart) {
        res.send(error === null ? newCart : error);
      });
    }
  });
});

module.exports = router;
