const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.authMiddleWare = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: 'Authorization failed, token missing !'
            })
        }

        const token  = authHeader.split(" ")[1];

        // verify and attach user object
        try {
            const payload = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(payload.id).select("-password")

            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "User not found !"
                })
            }

            req.user = user
            next();   // pass controll to the next middleware
        } 
        catch (error) {
            return res.status(401).json({
                success:false,
                message: "JWT verfication failed !"
            })
        }
    } 
    catch (err) {
        console.error(err)
        res.status(401).json({
            success: false,
            message: "Internal server error !"
        })
    }
}