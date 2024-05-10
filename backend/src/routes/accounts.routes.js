import {Router} from "express"
const router = Router();
import { addExpenditure, addIncomeByAdmin, addTransaction, addTransactionByAdmin, cashbook, getAllMaintenanceRecord, getExpenditureStatements, getIncomeStatements, getMaintenanceRecord, getTotalExpenditure, getTotalIncome, getTransaction, getTransaction5, incomeexpaccount, sendEmail } from "../controllers/accounts.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
router.route("/add-transaction").post(verifyJWT, addTransaction)
router.route("/add-admin-transaction").post(addTransactionByAdmin)
router.route("/add-admin-income").post(addIncomeByAdmin)
router.route("/add-expenditure").post(verifyJWT, addExpenditure)
router.route("/get-transaction").get(verifyJWT, getTransaction)
router.route("/get-total-income").get(getTotalIncome)
router.route("/get-total-exp").get(getTotalExpenditure)
router.route("/get-trans-5").get(verifyJWT, getTransaction5)
router.route("/get-maintenance-record").get(verifyJWT, getMaintenanceRecord)
router.route("/get-income-record").post(verifyJWT, getIncomeStatements)
router.route("/get-expenditure-record").post(verifyJWT, getExpenditureStatements)
router.route("/get-income-exp-record").get(verifyJWT, incomeexpaccount)
router.route("/get-books").post(verifyJWT, cashbook)
router.route("/get-all-record").get(verifyJWT, getAllMaintenanceRecord)
router.route("/sendrecieptmail").post(upload.single('receipt'), sendEmail)
export default router
