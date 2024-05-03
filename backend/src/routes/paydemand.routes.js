import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addPayDemand, getPayDemand } from "../controllers/paydemand.controller.js";
const router = Router();
router.route("/getpaydemand").get(getPayDemand)
router.route("/addpaydemand").post(addPayDemand)
export default router
