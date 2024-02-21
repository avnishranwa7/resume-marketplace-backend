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
  profile: {
    location: {
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    yoe: {
      type: Number,
      required: false,
    },
  },
  marketplaces: [String],
});

module.exports = mongoose.model("User", userSchema);
