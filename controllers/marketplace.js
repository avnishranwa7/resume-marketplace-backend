const jwt = require("jsonwebtoken");
const path = require("path");

// local imports
const User = require("../models/user.js");
const Marketplace = require("../models/marketplace.js");

const getMarketplaces = async (req, res, next) => {
  const userId = req.query.userId;

  try {
    const marketplaces = Marketplace.find({ userId }).sort({
      generationTime: -1,
    });

    res.status(200).json({
      message: "Marketplaces fetched",
      marketplaces: await marketplaces,
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
      generationTime: new Date(),
    });
    const result = await marketplace.save();

    const user = await User.findById(userId).select("marketplaces active");

    const newMarketplaces = [...user.marketplaces, result._id];
    await User.findByIdAndUpdate(userId, { marketplaces: newMarketplaces });
    res.status(201).json({
      message: "Marketplace created",
      id: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getResume = (req, res, next) => {
  try {
    const filename = path.join(
      path.resolve("./"),
      "uploads",
      req.query.filename
    );
    res.status(200).download(filename);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { getMarketplaces, createMarketplace, getResume };
