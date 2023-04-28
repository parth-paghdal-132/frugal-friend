const authRoutes = require("./authRoutes");
const myProfileRoutes = require("./myProfileRoutes");
const userProfileRoutes = require("./userProfileRoutes");
const trackingRoutes = require("./trackingRoutes");
const mailerRoutes = require("./mailerRoutes");
const rewardRoutes = require("./rewardRoutes");

const configRoutes = (app) => {
  console.log("here we are")
  app.use("/auth", authRoutes);
  app.use("/myprofile", myProfileRoutes);
  app.use("/user-profile", userProfileRoutes);
  app.use("/budget", mailerRoutes);
  app.use("", trackingRoutes);
  app.use("", rewardRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({
      status: 404,
      msg: "We can not seem to find the page you are looking for.",
    });
  });
};

module.exports = configRoutes;
