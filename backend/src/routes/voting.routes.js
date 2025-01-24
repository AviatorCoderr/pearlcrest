import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { register, registerVoterByOTP, voteLogin, voteLoginSendOtp, voteLoginOfficer, voteLoginSendOtpOfficer} from "../controllers/election.controller.js";
const router = Router();
router.route("/voter-reg-otp").post(registerVoterByOTP)
router.route("/voter-reg").post(register)
router.route("/voter-login").post(voteLogin)
router.route("/voter-otp").post(voteLoginSendOtp)
router.route("/voter-login-off").post(voteLoginOfficer)
router.route("/voter-otp-off").post(voteLoginSendOtpOfficer)
export default router

