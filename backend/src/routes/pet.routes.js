import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addAdminPets, getPets } from "../controllers/pets.controller.js";
const router = Router();
router.route("/add-pets").post(addAdminPets)
router.route("/get-pets").get(verifyJWT, getPets)
export default router
