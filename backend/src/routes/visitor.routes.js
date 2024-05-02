import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addvisitor, getAllVisitor, getvisitor } from "../controllers/visitor.controller.js";
const router = Router();
router.route("/add-visitor").post(addvisitor)
router.route("/get-visitor").post(verifyJWT, getvisitor)
router.route("/get-all-visitor").post(getAllVisitor)
export default router