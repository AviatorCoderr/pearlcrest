import express from 'express';
import { createComplaint, getComplaints, updateComplaintStatus, rateComplaint, getUserComplaints } from '../controllers/complaint.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post('/complaints', verifyJWT, createComplaint);
router.get('/complaints', verifyJWT, getComplaints);
router.patch('/complaints/:id', verifyJWT, updateComplaintStatus);
router.get('/user-complaints', verifyJWT, getUserComplaints);
router.patch('/complaints/:id/rate', verifyJWT, rateComplaint);
export default router;
