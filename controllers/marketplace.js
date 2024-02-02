// local imports
const User = require("../models/user.js");
const Marketplace = require("../models/marketplace.js");
const { handleFileUpload } = require("../services/handleFileUpload.js");

const getMarketplaces = async (req, res, next) => {
  const email = req.query.email;

  try {
    const user = await User.findOne({ email }).select("marketplaces");
    let marketplaces = [];

    res.status(200).json({
      message: "Marketplaces fetched",
      marketplaces,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const createMarketplace = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const category = req.body.category;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const fileUrl = req.file.path;

    const marketplace = new Marketplace({
      userId,
      name,
      category,
      tags,
      resumes: [fileUrl],
    });
    const result = await marketplace.save();

    const user = await User.findById(userId).select("marketplaces");
    const newMarketplaces = [...user.marketplaces, result._id];
    await User.findByIdAndUpdate(userId, { marketplaces: newMarketplaces });
    res.status(201).json({
      message: "Marketplace created",
      id: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422;
    }
    next(err);
  }
};

module.exports = { getMarketplaces, createMarketplace };
