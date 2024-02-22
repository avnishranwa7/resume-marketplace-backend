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

    const user = await User.findById(userId).select(
      "marketplaces active profile"
    );
    const country = user.profile.location.country || "";
    const yeo = user.profile.yeo ?? -1;
    if (country === "" || yeo === -1) {
      const error = new Error("Please complete your profile");
      error.statusCode = 422;
      throw error;
    }

    const marketplace = new Marketplace({
      userId,
      name,
      category,
      tags,
      resumes: [fileUrl],
      generationTime: new Date(),
    });
    const result = await marketplace.save();

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

const getResumes = async (req, res, next) => {
  let tags = req.body.tags || [];
  const page = req.body.page || 1;
  const offset = req.body.offset || 0;
  const city = req.body.city || "";
  const state = req.body.state || "";
  const country = req.body.country || "";
  const yeo = req.body.yeo || "";

  const users = await User.find({
    ...(city !== "" && { "profile.location.city": city }),
    ...(state !== "" && { "profile.location.state": state }),
    ...(country !== "" && { "profile.location.country": country }),
    ...(yeo !== "" && { "profile.yeo": +yeo ?? 0 }),
  }).select("marketplaces");

  tags = tags.map((tag) => tag.toLowerCase());
  try {
    let resumes = (
      await Marketplace.find().select("_id userId resumes tags")
    ).filter((r) => {
      if (tags.length === 0) return true;

      return (
        r.tags.filter((tag) => tags.includes(tag.toLowerCase())).length > 0
      );
    });

    resumes = resumes.filter((resume) =>
      users.some((user) => user.marketplaces.includes(resume._id))
    );

    let count = resumes.length;
    const startIndex = Math.max(
      (page + (offset <= 0 ? offset - 3 : offset + 1)) * 10,
      0
    );
    const endIndex = Math.min(
      (page + (offset < 0 ? offset - 2 : offset + 2)) * 10,
      count
    );
    resumes = resumes.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Resumes fetched successfully",
      resumes,
      count: Math.ceil(count / 10),
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

module.exports = {
  getMarketplaces,
  createMarketplace,
  getResumes,
  getResume,
};
