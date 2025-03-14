
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxxx", // Replace with your actual Firebase API key
  authDomain: "yourdomain.firebaseapp.com", // Replace with your actual Firebase auth domain
  projectId: "your-project-id", // Replace with your actual Firebase project ID
  storageBucket: "your-project-id.appspot.com", // Replace with your actual Firebase storage bucket
  messagingSenderId: "123456789", // Replace with your actual Firebase messaging sender ID
  appId: "1:123456789:web:abcdef", // Replace with your actual Firebase app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
