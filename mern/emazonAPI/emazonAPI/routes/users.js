var express = require("express");
var nodeMailer = require("nodemailer");
var router = express.Router();
//var User = require("../public/js/models/user");
var passport = require("passport");

var bcrypt = require("bcryptjs");

/* GET users listing. */
router.get("/", function(req, res, next) {
  const db = req.db;
  const collection = db.get("users");
  collection.find({}, {}, function(e, users) {
    res.json(users);
  });
});

router.get("/session", function(req, res, next) {
  if (req.session.userId) {
    res.send(req.session);
  } else {
    res.send({});
  }
});

router.post("/register", function(req, res, next) {
  const userName = req.body.userName;
  const email = req.body.email;
  let password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const type = "user";

  const db = req.db;
  const collection = db.get("users");
  collection
    .find({ email: email })
    .then(function(data) {
      if (data.length == 0) {
        if (password === repeatPassword) {
          password = bcrypt.hashSync(password, 10);

          const user = {
            userName,
            email,
            password,
            firstName,
            lastName,
            type
          };

          collection.insert(user, {}, function(err, result) {
            res.send(
              err === null ? { msg: result, success: true } : { msg: err }
            );

            if (err === null) {
              let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  // should be replaced with real sender's account
                  user: "elena.p.nikolova97",
                  pass: "08977068"
                }
              });
              let mailOptions = {
                // should be replaced with real recipient's account
                to: user.email,
                subject: "Hello new user!",
                body: "HI there",
                html: `<b>Hello ${userName}</b><div>Here are your credentials to login in Emazon bookstore: </div> <div>email: ${email}</div><div>password: ${
                  req.body.password
                }</div>
                <div>Best Regards</div>
                <div>Emazon team</div>`
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.status(400).send({ success: false });
                } else {
                  res.status(200).send({ success: true });
                }
                console.log(
                  "Message %s sent: %s",
                  info.messageId,
                  info.response
                );
              });
            }
          });
        } else {
          res.json({ success: false, message: "Passwords don't match!" });
        }
      } else {
        res.json({ success: false, message: "Email is already taken!" });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.put("/:id", function(req, res, next) {
  const db = req.db;
  const collection = db.get("users");
  const id = req.params.id;
  const newUser = req.body;
  collection.update({ _id: id }, newUser, function(err, result) {
    res.send(err === null ? { msg: result } : { msg: err });
  });
});

router.delete("/:id", function(req, res, next) {
  const db = req.db;
  const collection = db.get("users");
  const id = req.params.id;
  collection.findOneAndDelete({ _id: id }, {}, function(err, result) {
    res.send(err === null ? { msg: result } : { msg: err });
  });
});

router.post("/profile/logout", function(req, res, next) {
  req.session.destroy();
  res.json({ message: "successful logout" });
});

router.post("/", function(req, res, next) {
  const email = req.body.email;
  console.log(email);
  console.log(req.body);
  const password = req.body.password;
  const db = req.db;
  const collection = db.get("users");
  collection.find({ email: email }).then(function(data) {
    console.log(data);
    if (data.length == 0 || data === null) {
      res.json({ success: false, message: "Incorect email or password !" });
    } else {
      if (bcrypt.compareSync(password, data[0].password)) {
        req.session.userId = data[0]._id;
        req.session.userName = data[0].userName;
        req.session.firstName = data[0].firstName;
        req.session.lastName = data[0].lastName;
        req.session.type = data[0].type;

        res.json({
          userId: req.session.userId,
          userName: req.session.userName,
          firstName: req.session.firstName,
          lastName: req.session.lastName,
          type: req.session.type
        });
      } else {
        res.json({ success: false, message: "Incorect password !" });
      }
    }
  });
});

router.post("/send-email", function(req, res) {});

module.exports = router;
