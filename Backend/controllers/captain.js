const captainModel = require('../models/captain');
const captainService = require('../services/captain');
const blackListTokenModel = require('../models/blacklistToken');
const { validationResult } = require('express-validator');
const otpModel = require('../models/otp');
const otpGenerator = require('otp-generator');

exports.sendOTP = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }
    
    const { email } = req.body;

    if(!email){
      return res.status(401).json({
        success:false,
        message:"Please Enter Email First",
      });
    }

    const checkUserPresent = await captainModel.findOne({ email });
    
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `Captain is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    
    let result = await otpModel.findOne({ otp: otp });

    // console.log("OTP", otp);
    // console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await otpModel.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await otpModel.create(otpPayload);
    // console.log("OTP Body", otpBody);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });

  } 
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
    });
  }
}

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }

    const { fullname, email, password, vehicle, otp } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ 
            message: 'Captain already exist' 
        });
    }

    const recentOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });
    // console.log(recentOtp);

    
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not found",
      });
    } 
    else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ 
        token, 
        captain 
    });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ 
            message: 'Invalid email or password' 
        });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ 
            message: 'Invalid email or password' 
        });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ 
        token, captain 
    });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ 
        captain: req.captain 
    });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ 
        message: 'Logout successfully' 
    });
}