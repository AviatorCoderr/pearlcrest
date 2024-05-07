import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addReview, getReview } from "../controllers/review.controller.js";
const router = Router();
router.route("/add-review").post(addReview)
router.route("/get-review").get(getReview)
export default router