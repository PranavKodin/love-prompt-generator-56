
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy, Timestamp, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Firestore collections
export const usersCollection = collection(db, "users");
export const complimentsCollection = collection(db, "compliments");
export const subscriptionsCollection = collection(db, "subscriptions");

// Model interfaces
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  location?: string;
  createdAt: Timestamp;
  preferences?: {
    darkMode: boolean;
    language: string;
  };
  subscription?: {
    level: 'free' | 'premium';
    expiresAt: Timestamp;
  };
}

export interface Compliment {
  id?: string;
  userId: string;
  content: string;
  tone: string;
  mood: string;
  recipient?: string;
  createdAt: Timestamp;
  isSaved: boolean;
}

// Helper functions
export async function saveUserProfile(user: UserProfile) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, user, { merge: true });
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() as UserProfile : null;
}

export async function saveCompliment(compliment: Compliment) {
  const docRef = await addDoc(complimentsCollection, compliment);
  return { ...compliment, id: docRef.id };
}

export async function toggleSaveCompliment(complimentId: string, isSaved: boolean) {
  const complimentRef = doc(db, "compliments", complimentId);
  await updateDoc(complimentRef, { isSaved });
}

export async function getUserCompliments(userId: string) {
  const q = query(
    complimentsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }) as Compliment);
}

export async function getSavedCompliments(userId: string) {
  const q = query(
    complimentsCollection,
    where("userId", "==", userId),
    where("isSaved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }) as Compliment);
}

export async function deleteCompliment(complimentId: string) {
  const complimentRef = doc(db, "compliments", complimentId);
  await deleteDoc(complimentRef);
}
