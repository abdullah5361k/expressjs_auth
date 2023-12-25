const express = require("express")
const authRouter = express.Router()
const authController = require("../controllers/auth.controller")
const authVerfication = require("../middlewares/auth.middleware")
const signUpBodyValaidation = require("../middlewares/signUp_validator.middleware")
const signInBodyValaidation = require("../middlewares/signIn_validation.middleware")


authRouter.post("/signup", signUpBodyValaidation, authController.signUp)

authRouter.post("/signin", signInBodyValaidation, authController.signIn)

authRouter.get("/user", authVerfication, authController.getUser)

authRouter.get("/logout", authVerfication, authController.logout)

module.exports = authRouter