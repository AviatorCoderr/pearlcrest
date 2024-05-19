import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import axios from 'axios';
const firebaseConfig = {
  apiKey: "AIzaSyC9KWykEPu7LKzwoG836efHK7aO0kdUioU",
  authDomain: "pearl-crest.firebaseapp.com",
  projectId: "pearl-crest",
  storageBucket: "pearl-crest.appspot.com",
  messagingSenderId: "568971789490",
  appId: "1:568971789490:web:1c723d1d59b933f1ed75ab",
  measurementId: "G-9JVDBCNXYL"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const requestPermission = async () => {
  try {
    await Notification.requestPermission();
    console.log('Notification permission granted.');
  } catch (error) {
    console.error('Unable to get permission to notify.', error);
  }
};

export const getToken = async (setTokenFound) => {
  let currentToken = '';
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    currentToken = await messaging.getToken({ 
      vapidKey: "BNSb2BTILLKDUQBZQ-OUXAD1ZucN_R_fb58uUOktwyUQnIDV0dzGxH1w6-9ax6reYnZdhHgCvjAYfKSghoPy-hk",
      serviceWorkerRegistration
    });
    if (currentToken) {
      setTokenFound(true);
      console.log('Current token for client: ', currentToken);
      await sendTokenToBackend(currentToken);
    } else {
      setTokenFound(false);
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    setTokenFound(false);
    console.log('An error occurred while retrieving token. ', err);
  }
};

const sendTokenToBackend = async (token) => {
  try {
    const response = await axios.post('/api/v1/notifications/store-device-token', { token }, {
      withCredentials: true // Include cookies if necessary
    });
    console.log('Device token stored successfully', response);
  } catch (error) {
    console.error('Error storing device token:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

export default messaging;
