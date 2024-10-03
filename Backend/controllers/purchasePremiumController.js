const Razorpay = require("razorpay");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

// #region purchasePremium

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 99 * 100;
    const options = {
      amount,
      currency: "INR",
      receipt: "order_rcptid_11",
      payment_capture: "1",
    };

    const order = await rzp.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong with order creation",
      });
    }

    const createdOrder = await Order.create({
      orderId: order.id,
      userId: req.user._id,
      status: "pending",
      paymentId: null,
    });

    return res.status(200).json({
      success: true,
      key_id: rzp.key_id,
      order: createdOrder,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// #region updatePaymentStatus

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    console.log("Received order_id:", order_id);
    console.log("Received payment_id:", payment_id);

    const order = await Order.findOne({ orderId: order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentId = payment_id;
    order.status = "completed";
    await order.save();

    req.user.isPremiumUser = true;
    await req.user.save();

    const token = createJWT(req.user);

    return res
      .status(201)
      .json({ message: "Payment successful", token: token });
  } catch (err) {
    console.error("Error updating payment status:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

function createJWT(user) {
  return jwt.sign(
    { userId: user._id, isPremiumUser: user.isPremiumUser },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}
