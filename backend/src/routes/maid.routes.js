import {Router} from "express"
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addMaidByFlat, addMaid, getAllMaid, checkin, getAllMaidByFlat, deleteMaidbyFlat, addMaidbyloop } from "../controllers/maid.controller.js";
router.route("/add-maid-by-flat").post(verifyJWT, addMaidByFlat)
router.route("/add-maid").post(addMaid)
router.route("/get-all-maid").get(getAllMaid)
router.route("/checkin").post(checkin)
router.route("/getmaidbyflat").post(verifyJWT, getAllMaidByFlat)
router.route("/deletemaid").delete(verifyJWT, deleteMaidbyFlat)
router.route("/addbyloop").post(addMaidbyloop)
export default router