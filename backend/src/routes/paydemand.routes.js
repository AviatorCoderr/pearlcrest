import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addPayDemand, getPayDemand } from "../controllers/paydemand.controller.js";
const router = Router();
router.route("/getpaydemand").get(verifyJWT, getPayDemand)
router.route("/addpaydemand").post(verifyJWT, addPayDemand)
export default router
