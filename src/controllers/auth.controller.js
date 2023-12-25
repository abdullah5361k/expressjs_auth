const User = require("../models/user.model")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")

// Store user in DB => Register
exports.signUp = async (req, res) => {

    // Req Validation 
    if (reqValidation(req, res)) {
        return;
    }

    try {
        const { name, email, password } = req.body
        // Save user credentials in Db
        const newUser = new User({ name, email, password })
        const savedUser = await newUser.save()

        savedUser.password = undefined // Set password is undefineds
        return res.status(201).json({
            success: true,
            message: "User signIn successfully",
            data: savedUser,
        })
    } catch (err) {

        console.log("Error: ? ", err)

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User Registration failed",
                error: {
                    message: "User with the provided eamil alreday exists"
                }
            })
        }
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

// Validation on req body
function reqValidation(req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    console.log("ERRORs ", errors)

    // if there is error then return Error
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array(),
        });
        return true
    }
    return false
}


// validate user credentials :> Login
exports.signIn = async (req, res) => {

    // Req Validation 
    if (reqValidation(req, res)) {
        return;
    }

    try {
        const { email, password } = req.body

        // Check email exist in DB
        const userExists = await User.findOne({ email }).select("password")

        // If email not eixst then return error
        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: "Invalid email. Please try again with the correct credentials."
            })
        }

        // Get password from req body and compare it with hashed password
        const match = await bcrypt.compare(password, userExists.password)

        // If password not match then return error
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid password. Please try again with the correct credentials."
            })
        }

        // Generate JWT token
        const token = userExists.generateJwt(email)
        let options = {
            maxAge: 24 * 60 * 60 * 1000,  // Would expire in 24 hours
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        // Send cookies
        res.cookie("Token", token, options)

        return res.status(200).json({
            success: true,
            message: "Successfully Login"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            message: err.message
        })
    }

}


exports.getUser = async (req, res) => {
    try {
        const { id } = req.user

        // Find user in DB based on id
        const user = await User.findById(id)
        return res.status(200).json({
            success: true,
            message: "User found",
            data: user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        })
    }
}


exports.logout = (req, res) => {
    try {
        let options = {
            expires: new Date(),  // Would expire in 24 hours
            httpOnly: true
        }

        // Set cookie null
        res.cookie("token", null, options)
        return res.status(200).json({
            success: true,
            message: "User logout successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        })
    }
}