const mongoose = require("mongoose")

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

const dbConnect = async () =>{
    try {
        await mongoose.connect(DATABASE_URL)
        console.log("database connected successfully")
    } catch (error) {
        console.error("Database Connection failed :-" + error.message)
        process.exit(1);
    }
}

module.exports = dbConnect;