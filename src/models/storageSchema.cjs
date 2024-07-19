const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  cprice: { type: Number, required: true },
  fprice: { type: Number, required: true },
  count: { type: Number, required: true },
  _id: mongoose.Schema.Types.ObjectId,
});

const StorageItem = mongoose.model("StorageItem", storageSchema);

module.exports = StorageItem;
