const mongoose = require("mongoose");
const { isLowercase } = require("validator");
// const { isStrongPassword } = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("user", userSchema);
