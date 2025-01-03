// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4nqSxTd0uOeByCUxPO3dn4kYJCNfmcok",
  authDomain: "convex-aabac.firebaseapp.com",
  projectId: "convex-aabac",
  storageBucket: "convex-aabac.firebasestorage.app",
  messagingSenderId: "1025291388390",
  appId: "1:1025291388390:web:dd2f6c5b18cc3c3ea00227"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);