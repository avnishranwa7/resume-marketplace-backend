const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// local imports
const User = require("../models/user.js");
const { sendEmailVerification } = require("../services/nodemailer.js");

dotenv.config();

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
      active: { status: false },
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

const verification = async (req, res, next) => {
  const email = req.body.email;
  try {
    const token = jwt.sign({ email }, process.env.ACTIVE_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await User.findOneAndUpdate(
      { email },
      { "active.token": token, "active.generationTime": new Date() }
    );
    const response = await sendEmailVerification(email);
    if (response.accepted.length === 0) {
      const error = new Error("Could not send verification email");
      error.statusCode = 424;
      throw error;
    }

    res.status(200).json({
      message: "Verification email delivered successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { signup, verification };
