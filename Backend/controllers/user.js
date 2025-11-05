const userModel = require('../models/user');
const userService = require('../services/user');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken');
const otpGenerator = require('otp-generator');
const otpModel = require('../models/otp');

exports.sendOTP = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    // fetch email
    const { email } = req.body;

    if(!email){
      return res.status(401).json({
        success:false,
        message:"Please Enter Email First",
      });
    }

    // Check if user is already present
    const checkUserPresent = await userModel.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check unique otp or not
    let result = await otpModel.findOne({ otp: otp });

    // console.log("OTP", otp);
    // console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      // otp = Math.floor(Math.random()*900000 + 100000);
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

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { fullname, email, password, otp } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if(isUserAlready){
        return res.status(400).json({
            message: "User already exist"
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

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
    });
    // console.log("USER -> ", user);

    const token = user.generateAuthToken();

    res.status(201).json({
        success: true,
        token,
        user,
    });
}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email }).select('+password');

    if(!user){
        return res.status(401).json({
            success: false,
            message: "User does not exist",
        });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);

    return res.status(200).json({
        success: true,
        message: "login successfull",
        token,
        user,
    })
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    })
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    })
}