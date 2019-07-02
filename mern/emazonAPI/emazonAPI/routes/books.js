var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("books");
  collection.find({}, {}, function(err, books) {
    res.json(books);
  });
});

router.post("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("books");
  const book = req.body;
  collection.insert(book, {}, function(err, result) {
    res.send(err === null ? result : err);
  });
});

router.get("/:bookId", function(req,res,next) {
  const db = req.db;
  const bookId = req.params.bookId;
  const collection = db.get('books');
  collection.find({_id: bookId}, {}, function(err, result){
    res.json(result);
  })
})

module.exports = router;
