// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9KWykEPu7LKzwoG836efHK7aO0kdUioU",
  authDomain: "pearl-crest.firebaseapp.com",
  projectId: "pearl-crest",
  storageBucket: "pearl-crest.appspot.com",
  messagingSenderId: "568971789490",
  appId: "1:568971789490:web:1c723d1d59b933f1ed75ab",
  measurementId: "G-9JVDBCNXYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);