const User = require("../models/user");

const getUser = async (req, res, next) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);
    const profile = {
      name: user.name,
      profile: user.profile,
    };

    res.status(200).json({
      message: "User fetched successfully",
      data: profile,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const saveProfile = async (req, res, next) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const title = req.body.title;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;

  try {
    const user = await User.findById(userId);

    if (!name) {
      const error = new Error("Name is required");
      error.statusCode = 422;
      throw error;
    }

    if (!title) {
      const error = new Error("Title is required");
      error.statusCode = 422;
      throw error;
    }

    if (!country) {
      const error = new Error("Country is required");
      error.statusCode = 422;
      throw error;
    }

    await user.updateOne({
      name,
      "profile.title": title,
      "profile.location.city": city,
      "profile.location.state": state,
      "profile.location.country": country,
    });

    res.status(200).json({
      message: "Profile updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { getUser, saveProfile };
