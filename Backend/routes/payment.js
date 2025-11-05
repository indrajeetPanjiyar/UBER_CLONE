const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const { createOrder, verifyPayment } = require("../controllers/payments");

router.post("/create-order",
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("rideId").isMongoId().withMessage("Invalid Ride ID"),
    createOrder
);
router.post("/verify-payment", 
    body("razorpay_order_id").isString().withMessage("Invalid Order ID"),
    body("razorpay_payment_id").isString().withMessage("Invalid Payment ID"),
    body("razorpay_signature").isString().withMessage("Invalid Signature"),
    verifyPayment
);

module.exports = router;
