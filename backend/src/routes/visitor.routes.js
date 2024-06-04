import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addVisitor, getAllVisitor, getVisitor, getVisitors} from "../controllers/visitor.controller.js";
const router = Router();
router.route("/add-visitor").post(addVisitor)
router.route("/get-visitor").get(verifyJWT, getVisitor)
router.route("/get-all-visitor").get(getAllVisitor)
router.route("/get-visitors").get(verifyJWT, getVisitors)
export default router