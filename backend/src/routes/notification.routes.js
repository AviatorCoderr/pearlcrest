import { Router } from 'express';
import { deleteDeviceToken, storeDeviceToken } from '../controllers/notification.controller.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router()

// Route to store device token
router.route('/store-device-token').post(verifyJWT, storeDeviceToken);
router.route('/delete-device-token').post(verifyJWT, deleteDeviceToken);

export default router;
