import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import  {addRenter, updateAdminRenter, updateRenter, getRenter, getAllRenter} from "../controllers/renters.controller.js"
const router = Router();
router.route("/add-renter").post(addRenter)
router.route("/update-renter").patch(verifyJWT, updateRenter)
router.route("/admin-update-renter").patch(updateAdminRenter)
router.route("/get-renter").get(verifyJWT, getRenter)
router.route("/get-all-renter").get(verifyJWT, getAllRenter)
export default router
