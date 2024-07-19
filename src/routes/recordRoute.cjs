const express = require("express");
const router = express.Router();
const Record = require("../models/recordSchema");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
router.route("/records");
router.get("/", async (req, res) => {
  try {
    const records = await Record.find();
    res.send({
      result: records,
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Getting Records",
    });
  }
});
router.put("/del", async (req, res) => {
  try {
    let deletions = [];
    req.body.list.map((item) => {
      deletions.push({
        deleteOne: {
          filter: {
            _id: item.id,
          },
        },
      });
    });
    await Record.bulkWrite(deletions);
    res.send({
      status: "ok",
    });
  } catch (er) {
    console.log(er.message);
    res.send({
      status: "fail",
      message: "Error Handling Purchase",
    });
  }
});
module.exports = router;
