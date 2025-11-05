const userModel = require('../models/user');
const captainModel = require('../models/captain');
const blacklistTokenModel = require('../models/blacklistToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    // console.log("Auth Token:", token);

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, No token found",
        });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if(isBlacklisted){
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, Token is blacklisted",
        });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decode);
        const user = await userModel.findById(decode._id);
        // console.log("Authenticated User:", user);

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized, User not found",
            });
        }

        req.user = user;

        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, Invalid token",
        })
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, No token found",
        });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if(isBlacklisted){
        return res.status(401).json({
            message: "Unauthorized access, Token is blacklisted",
        });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decode._id);

        if(!captain){
            return res.status(401).json({
                message: "Unauthorized, Captain not found",
            });
        }

        req.captain = captain;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Unauthorized access, Invalid token",
        })
    }
}