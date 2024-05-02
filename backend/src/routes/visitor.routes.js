import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addvisitor, getAllVisitor, getvisitor, visitorCheckOut, visitorCheckin } from "../controllers/visitor.controller.js";
const router = Router();
router.route("/add-visitor").post(addvisitor)
router.route("/get-visitor").get(verifyJWT, getvisitor)
router.route("/get-all-visitor").get(getAllVisitor)
router.route("/checkin").post(visitorCheckin)
router.route("/checkoutr").post(visitorCheckOut)
export default router