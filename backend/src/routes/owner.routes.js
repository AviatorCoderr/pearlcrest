import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addOwner, updateOwner, updateAdminOwner, getOwner} from "../controllers/owners.controller.js";
const router = Router();
router.route("/add-owner").post(addOwner)
router.route("/update-owner").patch(verifyJWT,  updateOwner)
router.route("/admin-update-owner").patch(updateAdminOwner)
router.route("/get-owner").get(verifyJWT, getOwner)
export default router
