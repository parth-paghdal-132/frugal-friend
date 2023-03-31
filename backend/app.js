const express = require("express")
const configRoutes = require("./routes")
const session = require("express-session")

const public = express.static(__dirname + "/public")
const uploads = express.static(__dirname + "/uploads")
const app = express()

app.use("/public", public)
app.use("/uploads", uploads)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true,
    })
)

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    
    if(req.body && req.body._method) {
        req.method = req.body._method
        delete req.body._method
    }
    
    if(req.method === "POST" && req.originalUrl.startsWith("/service/alter-service")) {
        req.method = "PUT"
    }

    if(req.method === "POST" && req.originalUrl === "/user/myprofile") {
        req.method = "PUT"
    }

    next()
}

app.use(rewriteUnsupportedBrowserMethods)
configRoutes(app)

app.listen(4000, () => {
    console.log("Your server is running at http://localhost:4000");
});