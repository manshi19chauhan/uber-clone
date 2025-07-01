const userModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model.js');
const captainModel = require('../models/captain.model.js');

module.exports.authUser = async (req, res,next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    //decoded part comes in try and catch block
    // console.log("🔑 Token in request:", token);

    

    try{
        const isBlacklisted = await blacklistTokenModel.findOne({ token : token });
        // console.log("isbl", isBlacklisted);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // console.log("🔑 Token in request:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await userModel.findById(decoded._id).select('-password');
        // console.log(user)
        req.user = user;
        return next();
    }catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error("JWT error:", err.name, err.message);
        return res.status(401).json({ message: 'Unauthorized error' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id).select('-password');
        req.captain = captain;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error("JWT error:", err.name, err.message);
        return res.status(401).json({ message: 'Unauthorized error' });
    }
}