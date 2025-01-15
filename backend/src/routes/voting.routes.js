import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { register, registerVoterByOTP, voteLogin, voteLoginSendOtp} from "../controllers/election.controller.js";
const router = Router();
router.route("/voter-reg-otp").post(registerVoterByOTP)
router.route("/voter-reg").post(register)
router.route("/voter-login").post(voteLogin)
router.route("/voter-otp").post(voteLoginSendOtp)
export default router

