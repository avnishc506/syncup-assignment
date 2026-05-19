const express = require("express");
const router = express.Router();

const {
  getFeeds,
  addFeed,
} = require("../controllers/feedController");

router.get("/feed", getFeeds);
router.post("/feed", addFeed);

module.exports = router;