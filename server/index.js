require("dotenv").config()

const express = require("express")
const session = require("express-session")
const massive = require("massive")
const { json } = require("body-parser")
const ac = require("./controllers/authController")
const tc = require("./controllers/treasureController")
const auth = require("./middleware/authMiddleware")

const { CONNECTION_STRING, SESSION_SECRET } = process.env
const PORT = 4000

const app = express()
app.use(json())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
)
massive(CONNECTION_STRING).then(db => {
  app.set("db", db)
})

app.post("/auth/register", ac.register)
app.post("/auth/login", ac.login)
app.get("/auth/logout", ac.logout)
app.get("/api/treasure/dragon", tc.dragonTreasure)
app.get("/api/treasure/user", auth.usersOnly, tc.getUserTreasure)
app.get("/api/treasure/all", auth.usersOnly, auth.adminsOnly, tc.getAllTreasure)
app.post("/api/treasure/user", auth.usersOnly, tc.addUserTreasure)

app.listen(PORT, () => {
  console.log("I am listening on 4000")
})
