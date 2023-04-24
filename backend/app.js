const express = require("express")
const configRoutes = require("./routes")
const session = require("express-session")
const cors = require("cors")
const public = express.static(__dirname + "/public")
const uploads = express.static(__dirname + "/uploads")
const app = express()

app.use("/public", public)
app.use("/uploads", uploads)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))

app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true,
    })
)

configRoutes(app)

app.listen(4000, () => {
    console.log("Your server is running at http://localhost:4000");
});