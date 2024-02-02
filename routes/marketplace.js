const express = require("express");

const {
  getMarketplaces,
  createMarketplace,
} = require("../controllers/marketplace");

const router = express.Router();

router.get("/marketplaces", getMarketplaces);
router.post("/marketplace", createMarketplace);

module.exports = router;
