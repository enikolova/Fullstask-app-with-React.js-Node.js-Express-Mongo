var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("authors");
  collection.find({}, {}, function(err, authors) {
    res.json(authors);
  });
});

router.post("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("authors");
  const author = req.body;
  collection.insert(author, {}, function(err, author) {
    res.send(author);
  });
});

router.put("/:id", function(req, res, next) {
  const db = req.db;
  const collection = db.get("authors");
  const author = req.body;
  const id = req.params.id;
  collection.update({ _id: id }, author, function(err, result) {
    res.send(err === null ? result : err);
  });
});

router.get("/:authorName", function(req, res, next) {
  const db = req.db;
  const collection = db.get("authors");
  const authorName = req.params.authorName.split("-").join(" ");

  collection.findOne({ name: authorName }, {}, function(err, result) {
    res.json(result);
  });
});

module.exports = router;
