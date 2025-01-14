import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { registerVoter, voteLogin, voteLoginSendOtp} from "../controllers/election.controller.js";
const router = Router();
router.route("/voter-registration").post(registerVoter)
router.route("/voter-login").post(voteLogin)
router.route("/voter-otp").post(voteLoginSendOtp)
export default router

