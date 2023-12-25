const mongoose = require("mongoose")
const { Schema } = mongoose
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [35, "Name must be less than 35 char"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        lowercase: true,
        unique: [true, "Email already exist in DB"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        maxlength: 20,
        select: false
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiryDate: {
        type: String
    }
}, { timestamps: true })

// Method to generate JWt TOKEN
userSchema.methods.generateJwt = function (email) {
    const payLoad = {
        id: this._id,
        email
    }
    return jwt.sign(payLoad, process.env.SECRET_ACCESS_TOKEN, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours 
    })
}

// Mongoose middleware to hashed password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(err)
    }
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

const User = mongoose.model("User", userSchema)
module.exports = User