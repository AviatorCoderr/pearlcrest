// firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Initialize Firebase Admin SDK with service account credentials
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add additional options if needed
});

export default app;
