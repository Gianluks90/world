// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlICbGfC-jp2xW8_OoEs8PgQCQ4_2ktwk",
  authDomain: "worldmap-2025.firebaseapp.com",
  projectId: "worldmap-2025",
  storageBucket: "worldmap-2025.firebasestorage.app",
  messagingSenderId: "302454928180",
  appId: "1:302454928180:web:dfd77829f27cbbebe0eb61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)