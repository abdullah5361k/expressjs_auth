const jwt = require("jsonwebtoken")

const authVerfication = (req, res, next) => {
    const token = req.cookies && req.cookies.token || null
    // console.log("token ", token)/
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
        req.user = { id: decoded.id, email: decoded.email }
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        })
    }

    next()
}

module.exports = authVerfication