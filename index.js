require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const dbConnection = require("./config/db.config")
const authRouter = require("./src/routes/auth.route")
const cookieParser = require('cookie-parser')
const cors = require("cors")

dbConnection().then(res => {
    app.listen(PORT, () => {
        console.log("Server is running on " + PORT)
        // console.log(require('crypto').randomBytes(32).toString('hex'))
    })
}).catch(err => {
    console.log("db ", err)
})

app.use(express.json())
app.use(cookieParser())
app.use(cors())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/auth", authRouter)
app.get("/check", (req, res) => {
    console.log("Cehcs")
    res.status(200).json({
        success: true
    })
})