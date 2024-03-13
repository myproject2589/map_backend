export { };
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // strict: true,
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
