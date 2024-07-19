const express = require("express");
const router = express.Router();
const StorageItem = require("../models/storageSchema.cjs");
const Record = require("../models/recordSchema");
const mongoose = require("mongoose");
router.route("/storage");
const currentdate = new Date();
router.post("/add", async (req, res) => {
  try {
    var exists;
    let updates = [];
    let records = [];
    for (let item of req.body.list) {
      exists = await StorageItem.find({
        itemName: item.itemName,
        cprice: Number(item.cprice),
        fprice: Number(item.fprice),
      });
      if (exists.length > 0) {
        updates.push({
          updateOne: {
            filter: {
              itemName: item.itemName,
              cprice: item.cprice,
              fprice: item.fprice,
            },
            update: { $set: { count: exists[0].count + item.count } },
          },
        });
        records.push({
          insertOne: {
            document: {
              _id: new mongoose.Types.ObjectId(),
              name: "add",
              item: item.itemName,
              units: item.count,
              unitPrice: item.fprice,
              change: Number(item.count) * Number(item.fprice) * -1,
              time:
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds(),
            },
          },
        });
      } else {
        updates.push({
          insertOne: {
            document: {
              _id: new mongoose.Types.ObjectId(),
              itemName: item.itemName,
              cprice: item.cprice,
              fprice: item.fprice,
              count: item.count,
            },
          },
        });
        records.push({
          insertOne: {
            document: {
              _id: new mongoose.Types.ObjectId(),
              name: "add",
              item: item.itemName,
              units: item.count,
              unitPrice: item.fprice,
              change: Number(item.count) * Number(item.fprice) * -1,
              time:
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds(),
            },
          },
        });
      }
    }
    await Record.bulkWrite(records);
    await StorageItem.bulkWrite(updates);
    res.send({
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Updating Storage",
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const storageItems = await StorageItem.find();
    res.send({
      result: storageItems,
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Getting Storage",
    });
  }
});
router.put("/buy", async (req, res) => {
  try {
    let updates = [];
    let records = [];
    req.body.list.map((item) => {
      updates.push({
        updateOne: {
          filter: {
            itemName: item.itemName,
            cprice: Number(item.cprice),
            fprice: Number(item.fprice),
          },
          update: { $inc: { count: -item.count } },
        },
      });
      records.push({
        insertOne: {
          document: {
            _id: new mongoose.Types.ObjectId(),
            name: "sold",
            item: item.itemName,
            units: item.count,
            unitPrice: item.cprice,
            change: Number(item.count) * Number(item.fprice),
            time:
              currentdate.getDate() +
              "/" +
              (currentdate.getMonth() + 1) +
              "/" +
              currentdate.getFullYear() +
              " @ " +
              currentdate.getHours() +
              ":" +
              currentdate.getMinutes() +
              ":" +
              currentdate.getSeconds(),
          },
        },
      });
    });
    await Record.bulkWrite(records);
    await StorageItem.bulkWrite(updates);
    res.send({
      status: "ok",
    });
  } catch {
    res.send({
      status: "fail",
      message: "Error Handling Purchase",
    });
  }
});

module.exports = router;
