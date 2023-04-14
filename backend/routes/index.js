const authRoutes = require("./authRoutes")
const trackingRoutes = require("./trackingRoutes");

const configRoutes = (app) => {
	app.use("/auth", authRoutes)
    app.use("", trackingRoutes)
	
    app.use("*", (req, res) => {
        return res.status(404).json({
          	status: 404,
          	msg: "We can not seem to find the page you are looking for."
        })
    });
}

module.exports = configRoutes