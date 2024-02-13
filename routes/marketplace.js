const express = require("express");
const jwt = require("jsonwebtoken");

const {
  getMarketplaces,
  createMarketplace,
  getResumes,
  getResume,
} = require("../controllers/marketplace");

const router = express.Router();

function getMiddleware(req, res, next, cb) {
  const token = req.query.token;
  try {
    jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
    cb(req, res, next);
  } catch (err) {
    if (err.message === "jwt expired") {
      err.message = "Token Expired";
      err.statusCode = 422;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

function postMiddleware(req, res, next, cb) {
  const token = req.body.token;
  try {
    jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
    cb(req, res, next);
  } catch (err) {
    if (err.message === "jwt expired") {
      err.message = "Token Expired";
      err.statusCode = 422;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

router.get("/marketplaces", (req, res, next) => {
  getMiddleware(req, res, next, getMarketplaces);
});
router.post("/get-resumes", getResumes);
router.get("/get-resume", getResume);

router.post("/marketplace", (req, res, next) => {
  postMiddleware(req, res, next, createMarketplace);
});

module.exports = router;
