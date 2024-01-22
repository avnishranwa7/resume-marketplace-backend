const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// local imports
const User = require("../models/user.js");

const signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() || password !== confirmPassword) {
      const error = new Error("Verification failed");
      error.statusCode = 422;
      error.data = [
        ...errors.array(),
        password !== confirmPassword && {
          msg: "Passwords do not match",
          path: "confirmPassword",
          value: confirmPassword,
        },
      ];
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    const result = await user.save();
    res.status(201).json({
      message: "New user created",
      userId: result._id,
      email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { signup };
