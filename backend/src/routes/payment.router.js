import {Router} from "express"
import { PaymentVerification, checkout } from "../controllers/payment.controller.js";
const router = Router();
router.route("/checkout").post(checkout)
router.route("/paymentverification").post(PaymentVerification)
export default router