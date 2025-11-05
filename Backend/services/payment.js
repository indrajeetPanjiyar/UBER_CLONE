const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.createOrder = async (amount, rideId) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${rideId}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

module.exports.verifyPayment = (order_id, payment_id, signature) => {
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  return generated_signature === signature;
};
