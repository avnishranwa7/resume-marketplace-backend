const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  active: {
    status: {
      type: Boolean,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
  },
  marketplaces: [String],
});

module.exports = mongoose.model("User", userSchema);
