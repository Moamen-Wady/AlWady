const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.cjs");
const mongoose = require("mongoose");
router.route("/users");

router.get("/", async (req, res) => {
  try {
    await User.find().then((result) =>
      res.send({
        status: "ok",
        result: result,
      })
    );
  } catch {
    res.send({
      status: "fail",
      message: "Error Finding Users",
    });
  }
});
router.post("/login", async (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;
  try {
    await User.find({ userName: userName }).then((dbu) => {
      if (JSON.stringify(password) === JSON.stringify(dbu[0].password)) {
        res.send({
          status: "ok",
          user: dbu[0],
        });
      } else {
        res.send({
          status: "pw",
          message: "Incorrect Password",
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.send({
      status: "n/a",
      message: "Username Not Found",
    });
  }
});
router.post("/signup", async (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;
  var role = req.body.role;
  try {
    await User.find({ userName: userName }).then(async (arr) => {
      if (arr.length > 0) {
        res.send({
          status: "fail",
          message: "User Already Exists",
        });
      } else {
        var thisUser = new User({
          _id: new mongoose.Types.ObjectId(),
          userName: userName,
          password: password,
          role: role,
        });
        await thisUser.save().then(() => {
          res.send({
            status: "ok",
          });
        });
      }
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Signing Up",
    });
  }
});
router.put("/revoke", async (req, res) => {
  try {
    const updates = req.body.list.map((item) => ({
      updateOne: {
        filter: { userName: item.userName },
        update: { $set: { role: "cashier" } },
      },
    }));
    await User.bulkWrite(updates);

    res.send({
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Updating Roles",
    });
  }
});
router.put("/admin", async (req, res) => {
  try {
    const updates = req.body.list.map((item) => ({
      updateOne: {
        filter: { userName: item.userName },
        update: { $set: { role: "admin" } },
      },
    }));

    await User.bulkWrite(updates);

    res.send({
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Updating Roles",
    });
  }
});
router.put("/del", async (req, res) => {
  try {
    const deletions = req.body.list.map((item) => ({
      deleteOne: {
        filter: { userName: item.userName },
      },
    }));
    await User.bulkWrite(deletions);
    res.send({
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Deleting User/s",
    });
  }
});

module.exports = router;
