import {Router} from "express"
const router = Router();
import { Approvepayment, addExpenditure, addIncomeByAdmin, addTransaction, addTransactionByAdmin, addUnVerfiedTransaction, cashbook, denyPayment, generatedQr, getAllMaintenanceRecord, getExpenditureStatements, getIncomeStatements, getMaintenanceRecord, getMaintenanceRecordByFlat, getTotalExpenditure, getTotalIncome, getTransaction, getTransaction5, getUnTrans, incomeexpaccount, sendEmail, updateMainbyloop } from "../controllers/accounts.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
router.route("/add-transaction").post(verifyJWT, addTransaction)
router.route("/add-admin-transaction").post(verifyJWT, addTransactionByAdmin)
router.route("/add-admin-income").post(verifyJWT, addIncomeByAdmin)
router.route("/add-expenditure").post(verifyJWT, addExpenditure)
router.route("/get-transaction").get(verifyJWT, getTransaction)
router.route("/get-total-income").get(verifyJWT, getTotalIncome)
router.route("/get-total-exp").get(verifyJWT, getTotalExpenditure)
router.route("/get-trans-5").get(verifyJWT, getTransaction5)
router.route("/get-maintenance-record").get(verifyJWT, getMaintenanceRecord)
router.route("/get-income-record").post(verifyJWT, getIncomeStatements)
router.route("/get-expenditure-record").post(verifyJWT, getExpenditureStatements)
router.route("/get-income-exp-record").get(verifyJWT, incomeexpaccount)
router.route("/get-books").post(verifyJWT, cashbook)
router.route("/get-all-record").get(verifyJWT, getAllMaintenanceRecord)
router.route("/sendreceiptmail").post(verifyJWT, upload.single('receipt'), sendEmail)
router.route("/generate-qr").post(verifyJWT, generatedQr)
router.route("/add-untrans").post(verifyJWT, addUnVerfiedTransaction)
router.route("/get-untrans").get(verifyJWT, getUnTrans)
router.route("/approve").post(verifyJWT, Approvepayment)
router.route("/deny").  post(verifyJWT, denyPayment)
router.route("/updatemaintenance").post(updateMainbyloop)
router.route("/getmaint").post(verifyJWT, getMaintenanceRecordByFlat)
export default router
