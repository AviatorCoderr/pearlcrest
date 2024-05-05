import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import  {addRenter, updateAdminRenter, updateRenter, getRenter} from "../controllers/renters.controller.js"
const router = Router();
router.route("/add-renter").post(addRenter)
router.route("/update-renter").patch(verifyJWT, updateRenter)
router.route("/admin-update-renter").patch(updateAdminRenter)
router.route("/get-renter").get(verifyJWT, getRenter)
export default router
