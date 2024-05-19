import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC9KWykEPu7LKzwoG836efHK7aO0kdUioU",
  authDomain: "pearl-crest.firebaseapp.com",
  projectId: "pearl-crest",
  storageBucket: "pearl-crest.appspot.com",
  messagingSenderId: "568971789490",
  appId: "1:568971789490:web:1c723d1d59b933f1ed75ab",
  measurementId: "G-9JVDBCNXYL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);