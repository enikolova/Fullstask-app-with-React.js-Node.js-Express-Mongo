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

router.delete("/:userId", function(req, res, next) {
  const db = req.db;
  const collection = db.get("carts");
  const removedBook = req.body.bookId;
  const userId = req.params.userId;

  collection.findOne({ userId: userId }, {}, function(err, cart) {
    const bookIndex = cart.books.findIndex(book => book._id === removedBook);
    cart.books.splice(bookIndex, 1);
    collection.update(
      { _id: cart._id },
      { $set: { books: cart.books } },
      function(err, result) {
        res.send(err === null ? result : err);
      }
    );
  });
});

router.post("/:userId", function(req, res, next) {
  const db = req.db;
  const collection = db.get("carts");
  const book = req.body.book;
  const userId = req.params.userId;
  const userSession = req.session.userId;
  console.log(userSession);
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
