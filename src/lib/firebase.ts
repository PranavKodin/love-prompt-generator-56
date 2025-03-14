
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
            apiKey: "AIzaSyAcyBLG5mcrxyEwbBsyq4xX2Hh2Es6L1Ok",
            authDomain: "portfolio-ce615.firebaseapp.com",
            projectId: "portfolio-ce615",
            storageBucket: "portfolio-ce615.appspot.com",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
        };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
