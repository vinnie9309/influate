// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq8Qr02VNXya8k8sDPu6j5dnqvFDEnGx4",
  authDomain: "shortmemory-6f0db.firebaseapp.com",
  projectId: "shortmemory-6f0db",
  storageBucket: "shortmemory-6f0db.appspot.com",
  messagingSenderId: "898190403263",
  appId: "1:898190403263:web:caac5d793bd4d24f71480a",
  measurementId: "G-H0ZHGQMZZM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export default firebase_app;
