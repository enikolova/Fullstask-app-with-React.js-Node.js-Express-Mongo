var express = require("express");
var router = express.Router();

router.get("/:book_id", function(req, res, next) {
  const db = req.db;
  const bookId = req.params.book_id;
  const collection = db.get("comments");
  collection.find({ bookId: bookId }, {}, function(err, result) {
    const usersCollection = db.get("users");
    let reviews = [];
    if (result.length > 0) {
      result.forEach((review, index) => {
        usersCollection.findOne({ _id: review.userId }, {}, function(e, user) {
          if (user) {
            review.user = user;
            reviews.push(review);
          }

          if (index === result.length - 1) {
            console.log(result);
            res.json(reviews);
          }
        });
      });
    }
  });
});

router.get("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("comments");
  collection.find({}, {}, function(err, result) {
    res.json(result);
  });
});

router.post("/", function(req, res, next) {
  const db = req.db;
  const comment = req.body;

  console.log(req.session);
  const collection = db.get("comments");
  if (req.session.userId) {
    collection.insert(comment, {}, function(err, result) {
      res.send(err === null ? result : err);
    });
  } else {
    res.send("You cannot add comment. Please login");
  }
});

router.put("/:id", function(req, res, next) {
  const db = req.db;
  const collection = db.get("comments");
  const id = req.params.id;
  const newComment = req.body;

  collection.update({ _id: id }, newComment, function(err, result) {
    res.send(err === null ? result : err);
  });
});

module.exports = router;
