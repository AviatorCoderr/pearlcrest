import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addvisitor, getvisitor } from "../controllers/visitor.controller.js";
import { get } from "mongoose";
const router = Router();
router.route("/add-visitor").post(addvisitor)
router.route("/get-visitor").get(verifyJWT, getvisitor)
export default router