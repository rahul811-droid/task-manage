// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mer-real-estate.firebaseapp.com",
  projectId: "mer-real-estate",
  storageBucket: "mer-real-estate.appspot.com",
  messagingSenderId: "842699503733",
  appId: "1:842699503733:web:d5b08e40645b4f62fce03c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 