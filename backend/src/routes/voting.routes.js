import {Router} from "express"
import { verifyElectionOfficer, verifyJWT, verifyVoter } from "../middlewares/auth.middleware.js"
import { register, registerVoterByOTP, voteLogin, voteLoginSendOtp, registerCandidates, voteLoginOfficer, voteLoginSendOtpOfficer, logoutuser, logoutOfficer, getCandidates} from "../controllers/election.controller.js";
const router = Router();
router.route("/voter-reg-otp").post(registerVoterByOTP)
router.route("/voter-reg").post(register)
router.route("/voter-login").post(voteLogin)
router.route("/voter-otp").post(voteLoginSendOtp)
router.route("/voter-login-off").post(voteLoginOfficer)
router.route("/voter-otp-off").post(voteLoginSendOtpOfficer)
router.route("/voter-logout").post(verifyVoter, logoutuser)
router.route("/officer-logout").post(verifyElectionOfficer, logoutOfficer)
router.route("/create-cand").post(registerCandidates);
router.route("/get-cand").get(verifyVoter, getCandidates);
export default router

