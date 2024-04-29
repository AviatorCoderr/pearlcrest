import { asyncHandler } from "../utils/asynchandler.js";
import { instance } from "../razorpay/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto"; // Import crypto module for signature generation

export const checkout = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    var options = {
        amount: Number(amount * 100),
        currency: "INR"
    };
    const order = await instance.orders.create(options);
    res.status(200).json(new ApiResponse(200, { order }, "order created successfully"));
});

export const PaymentVerification = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex")

    if (expectedSignature === razorpay_signature) {
        // Payment verification successful
        // You can handle further actions here, like updating database records or sending email notifications
        res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
        // Signature mismatch, payment verification failed
        res.status(400).json({ success: false });
    }
});
