import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addAdminPets } from "../controllers/pets.controller.js";
const router = Router();
router.route("/add-pets").post(addAdminPets)
export default router
