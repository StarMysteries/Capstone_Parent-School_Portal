// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDoi_jvNIbRg9HyhRLmg31p7Wkik02UxW8",
  authDomain: "parent-school-portal.firebaseapp.com",
  projectId: "parent-school-portal",
  storageBucket: "parent-school-portal.firebasestorage.app",
  messagingSenderId: "484669447727",
  appId: "1:484669447727:web:f78b3aaf35b37e03d370da",
  measurementId: "G-5113KD7PSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);