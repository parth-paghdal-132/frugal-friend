const authRoutes = require("./authRoutes")
const myProfileRoutes = require("./myProfileRoutes")
const configRoutes = (app) => {
	app.use("/auth", authRoutes)
    app.use("/myprofile", myProfileRoutes)

    app.use("*", (req, res) => {
        return res.status(404).json({
          	status: 404,
          	msg: "We can not seem to find the page you are looking for."
        })
    });
}

module.exports = configRoutes