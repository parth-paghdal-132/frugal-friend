const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers/trackingValidation");
const client = require("../config/redis");

const userData = require("./authData");

// const reward = mongoCollections.reward;

// getting reward for same month is covered by trackingData

const rewards = {
  goal: 7,
  income: 2,
  expense: 1,
  withinBudget: 20,
  withinGoal: 10,
};

const setReward = async (userId, type, month) => {
  // validate userId
  helpers.checkIsProperString(userId);
  helpers.checkIsValidObjectId(userId);

  // validate type
  if (!(type in rewards)) {
    throw new Error("Please supply a valid reward type");
  }

  // validate month
  if (month < 1 || month > 12) {
    throw new Error("Please supply valid month (0-11)");
  }

  // get user
  const user = await userData.getUser(userId);

  // need to update user object in redis when image is updated

  const userInfo = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };

  let exists = await client.zRank("mostPoints", JSON.stringify(userInfo));
  if (exists !== null) {
    //user is ranked in points
    await client.zIncrBy("mostPoints", rewards[type], JSON.stringify(userInfo));
  } else {
    await client.zAdd("mostPoints", {
      score: rewards[type],
      value: JSON.stringify(userInfo),
    });
  }

  // let newReward = {
  //   userId: user._id,
  //   point: rewards[type],
  //   date: new Date()
  // }

  // const rewardCollection = await reward();
  // const insertInfo = await rewardCollection.insertOne(newReward);
};

const updateUserInRedis = async (oldUser, newUser) => {
  let findUser = {
    username: oldUser.username,
    firstName: oldUser.firstName,
    lastName: oldUser.lastName,
    image: oldUser.image,
  };

  // find current user in redis
  let exists = await client.zScore("mostPoints", JSON.stringify(findUser));
  if (exists !== null) {
    // remove oldUser
    await client.zRem("mostPoints", JSON.stringify(findUser));
    // add newUser
    await client.zAdd("mostPoints", {
      score: exists,
      value: JSON.stringify(newUser),
    });
  } else {
  }
};

const getMostPoints = async () => {
  const scores = await client.sendCommand([
    "ZREVRANGE",
    "mostPoints",
    "0",
    "9",
    "withscores",
  ]);
  // scores returns array with pairs of value, score
  let userScores = [];
  scores.forEach((item, index) => {
    if (index % 2 === 0) {
      // on a user object
      let user = JSON.parse(item);
      user.points = scores[index + 1];
      userScores.push(user);
    }
  });
  return userScores;
};

const getAllRewards = async () => {
  const scores = await client.sendCommand([
    "ZREVRANGE",
    "mostPoints",
    "0",
    "-1",
    "withscores",
  ]);
  // scores returns array with pairs of value, score
  let userScores = [];
  scores.forEach((item, index) => {
    if (index % 2 === 0) {
      // on a user object
      let user = JSON.parse(item);
      user.points = scores[index + 1];
      userScores.push(user);
    }
  });
  return userScores;
};

module.exports = {
  setReward,
  updateUserInRedis,
  getMostPoints,
  getAllRewards,
};
