const express = require("express");

const { getMiddleware, postMiddleware } = require("../middlewares/index");
const { getUser, saveProfile } = require("../controllers/user");

const router = express.Router();

router.get("/user", (req, res, next) => {
  getMiddleware(req, res, next, getUser);
});

router.post("/user", (req, res, next) => {
  postMiddleware(req, res, next, saveProfile);
});

module.exports = router;
