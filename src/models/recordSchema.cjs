const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  item: { type: String, required: true },
  units: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  change: { type: Number, required: true },
  time: { type: String, required: true },
  _id: mongoose.Schema.Types.ObjectId,
});
const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
