import { Router } from 'express';
import { storeDeviceToken } from '../controllers/notification.controller.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router()

// Route to store device token
router.route('/store-device-token').post(verifyJWT, storeDeviceToken);

export default router;
