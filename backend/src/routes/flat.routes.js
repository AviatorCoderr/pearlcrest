import {Router} from "express"
const router = Router();
import { adminresetpassword, changepassword, displayFlats, getCurrentUser, loginFlat, logoutUser, registerFlat, registerFlatbyAdmin, sendOtpVerificationEmail } from "../controllers/flat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
router.route("/register").post(registerFlat)
router.route("/admin-reset-password").patch(adminresetpassword)
router.route("/login").post(loginFlat)
router.route("/display-flat").get(displayFlats)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/logout-user").get(verifyJWT, logoutUser)
router.route("/send-otp").post(sendOtpVerificationEmail)
router.route("/change-password").post(changepassword)
router.route("/reg").post(registerFlatbyAdmin)

export default router