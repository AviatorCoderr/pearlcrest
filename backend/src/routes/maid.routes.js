import {Router} from "express"
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addMaidByFlat, addMaid, getAllMaid } from "../controllers/maid.controller.js";
router.route("/add-maid-by-flat").post(addMaidByFlat)
router.route("/add-maid").post(addMaid)
router.route("/get-all-maid").post(getAllMaid)
export default router