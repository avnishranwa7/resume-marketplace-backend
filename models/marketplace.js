const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const marketplaceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  tags: [String],
  resumes: [String],
});

module.exports = mongoose.model("Marketplace", marketplaceSchema);
