import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addquestion, getquestions, novote, yesvote } from "../controllers/vote.controller.js";
const router = Router();
router.route("/vote-yes").post(verifyJWT, yesvote)
router.route("/vote-no").post(verifyJWT, novote)
router.route("/add-qs").post(verifyJWT, addquestion)
router.route("/get-all-qs").post(verifyJWT, getquestions)
export default router

