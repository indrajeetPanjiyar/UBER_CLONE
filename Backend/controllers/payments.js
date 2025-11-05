const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const mailSender = require("../utils/mailSender");

const paymentService = require("../services/payment");

module.exports.createOrder = async (req, res) => {
  try {
    const { amount, rideId } = req.body;

    if (!amount || !rideId) {
      return res.status(400).json({ message: "Amount and Ride ID required" });
    }

    const order = await paymentService.createOrder(amount, rideId);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { name, email, amount, orderId, paymentId, signature } = req.body;

    const verified = paymentService.verifyPayment(
      orderId,
      paymentId,
      signature
    );

    if (!verified) {
      return res.status(400).json({ 
        message: "Payment verification failed" 
      });
    }
    else if(verified){
        try {
            const mailResponse = await mailSender(
                email,
                "Verification Email",
                paymentSuccessEmail(name, amount, orderId, paymentId)
            );
        } 
        catch (error) {
            console.log("Error occurred while sending email: ", error);
            throw error;
        }
    }

    res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        message: "Error verifying payment" 
    });
  }
};
