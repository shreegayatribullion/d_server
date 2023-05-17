const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_live_aBs0ePN97PGbnR",
  key_secret: "qYpJ0m2ucuWvKiGHAWYhttNx",
});

exports.processPayment = async (req, res, next) => {
  try {
    const { amount, currency } = req.body.inititateOrderDetail;

    const payment_capture = 1;
    const options = { amount, currency, payment_capture };

    const response = await razorpay.orders.create(options);

    console.log("response", response);

    const { id } = response;

    res.json({ orderId: id });
  } catch (error) {
    console.log("error", error);
    res.send(500).json({
      message: "something went wrong!",
    });
  }
};
