import admin from './firebaseAdmin.js';
import { deleteDeviceToken } from './controllers/notification.controller.js';

// Function to send push notification to a specific device
export async function sendPushNotificationToDevice(deviceToken, flatid, title, body) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.log('Error sending message:', error);
    if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
      console.log('Invalid token. Deleting device token.');
      // Delete the device token
      deleteDeviceToken(deviceToken, flatid);
    } else {
      console.log('Unknown error. Retrying later...', error);
    }
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
