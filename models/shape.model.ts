export { };
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const shapeSchema = new mongoose.Schema({
    type: String,
    coordinates: Array,
    center: Array,
    radius: Number,
    position: Array,
    label:String,
    isGroup: {
      type: Boolean,
      default: false
    },
    UniqueId:String,
  });

  module.exports = mongoose.model("shape", shapeSchema);
