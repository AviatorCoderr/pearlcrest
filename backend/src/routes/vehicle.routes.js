import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddVehicle, getVehiclebyNumber, getVehicles, updateVehicles, generateChallan, getChallansByFlat, getChallans } from "../controllers/vehicles.controllers.js";

const router = Router();
router.route("/add-vehicle").post(verifyJWT, AddVehicle);
router.route("/get-vehicles").get(verifyJWT, getVehicles);
router.route("/get-vehicle-by-regno").post(getVehiclebyNumber);
router.route("/update-vehicle").patch(updateVehicles);
router.route("/generate-challan").post(generateChallan); 
router.route("/challans").post(verifyJWT, getChallansByFlat);  
router.route("/allchallans").get(verifyJWT, getChallans);  

export default router;
