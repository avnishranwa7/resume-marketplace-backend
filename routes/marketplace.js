const express = require("express");
const jwt = require("jsonwebtoken");

const {
  getMarketplaces,
  createMarketplace,
  getResumes,
  getResume,
} = require("../controllers/marketplace");

const { getMiddleware, postMiddleware } = require("../middlewares/index");

const router = express.Router();

router.get("/marketplaces", (req, res, next) => {
  getMiddleware(req, res, next, getMarketplaces);
});
router.post("/get-resumes", getResumes);
router.get("/get-resume", getResume);

router.post("/marketplace", (req, res, next) => {
  postMiddleware(req, res, next, createMarketplace);
});

module.exports = router;
