const express = require("express");
const data = require("../data");
const rewardData = data.rewardData;

const router = express.Router();

router.get("/mostPoints", async (req, res) => {
  let scores = await rewardData.getMostPoints();
  res.json(scores);
});

router.get("/reward", async (req, res) => {
  let rewards = await rewardData.getAllRewards();
  res.json(rewards);
});

module.exports = router;
