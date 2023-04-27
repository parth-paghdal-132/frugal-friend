const express = require("express");
const data = require("../data")
const rewardData = data.rewardData;

const router = express.Router();

router.get('/mostPoints', async (req, res) => {
  console.log('here')
  let scores = await rewardData.getMostPoints();
  res.json(scores);
});

module.exports = router;