import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addvisitor } from "../controllers/visitor.controller.js";
const router = Router();
router.route("/add-visitor").post(addvisitor)
export default router