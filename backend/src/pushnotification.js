// pushNotification.js

import admin from './firebaseAdmin.js'; // Adjust the path as needed

// Function to send push notification to a specific device
export async function sendPushNotificationToDevice(deviceToken, title, body) {
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: deviceToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
