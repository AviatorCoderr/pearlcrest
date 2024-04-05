import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { Fourwheeler, Twowheeler, bicycle } from "../controllers/vehicles.controllers.js";
const router = Router();
router.route("/add-four-wheeler").post(Fourwheeler)
router.route("/add-two-wheeler").post(Twowheeler)
router.route("/add-bicycle").post(bicycle)
export default router