import {Router} from "express"
const router = Router();
import { adminresetpassword, changePassword, displayFlats, getCurrentUser, loginFlat, registerFlat } from "../controllers/flat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
router.route("/register").post(registerFlat)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/admin-reset-password").patch(adminresetpassword)
router.route("/login").post(loginFlat)
router.route("/display-flat").get(displayFlats)
router.route("/get-current-user").get(getCurrentUser)
export default router