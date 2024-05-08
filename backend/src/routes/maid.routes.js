import {Router} from "express"
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addMaidByFlat, addMaid, getAllMaid, checkin, checkout, getAllMaidByFlat } from "../controllers/maid.controller.js";
router.route("/add-maid-by-flat").post(verifyJWT, addMaidByFlat)
router.route("/add-maid").post(addMaid)
router.route("/get-all-maid").get(getAllMaid)
router.route("/checkin").post(checkin)
router.route("/getmaidbyflat").post(getAllMaidByFlat)
export default router