import {Router} from "express"
import { addresbyFlat, cancelBooking, deleteres, getAllBooking, getres, trackdates, updateres } from "../controllers/facilityreservation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/book-facility").post(verifyJWT, addresbyFlat)
router.route("/reject-booking").post(verifyJWT, deleteres)
router.route("/accept-booking").post(verifyJWT, updateres)
router.route("/get-booking").get(verifyJWT, getres)
router.route("/get-all-booking").get(verifyJWT, getAllBooking)
router.route("/cancel-booking").post(verifyJWT, cancelBooking)
router.route("/trackdates").get(verifyJWT, trackdates)
export default router