import {Router} from "express"
const router = Router();
import { addExpenditure, addIncomeByAdmin, addTransaction, addTransactionByAdmin, getMaintenanceRecord, getTotalExpenditure, getTotalIncome, getTransaction, getTransaction5 } from "../controllers/accounts.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
router.route("/add-transaction").post(verifyJWT, addTransaction)
router.route("/add-admin-transaction").post(addTransactionByAdmin)
router.route("/add-admin-income").post(addIncomeByAdmin)
router.route("/add-expenditure").post(verifyJWT, addExpenditure)
router.route("/get-transaction").get(verifyJWT, getTransaction)
router.route("/get-total-income").get(getTotalIncome)
router.route("/get-total-exp").get(getTotalExpenditure)
router.route("/get-trans-5").get(verifyJWT, getTransaction5)
router.route("/get-maintenance-record").get(verifyJWT, getMaintenanceRecord)
export default router
