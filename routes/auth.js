const express = require("express");
const { body } = require("express-validator");

// local imports
const User = require("../models/user.js");
const { signup } = require("../controllers/auth.js");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email already exists.");
        }
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters longer"),
    body("confirmPassword")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters longer"),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

module.exports = router;
