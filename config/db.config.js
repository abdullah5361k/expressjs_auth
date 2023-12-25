const mongoose = require("mongoose")

const dbConnection = async () => {
    try {
        const c = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection to db" + c.connection.host)
    } catch (error) {
        console.log("DB errro ", error)
        throw new error
    }
}

module.exports = dbConnection