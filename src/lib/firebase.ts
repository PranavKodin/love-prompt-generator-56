
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7rKchkRNNvGHnCgiYewbvSBQl8-F48vk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "love-prompt-gen.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "love-prompt-gen",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "love-prompt-gen.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "953062391054",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:953062391054:web:7e1d0b4eba55cc2fec3c6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Collection references
const complimentsCollection = collection(db, "compliments");

// Types
export interface Compliment {
  id?: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  isPublic: boolean;
  likeCount: number;
  likedBy: string[];
}

export interface User {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  savedCompliments?: string[];
}

// Compliment functions
export const saveCompliment = async (compliment: Omit<Compliment, 'id' | 'createdAt' | 'likeCount' | 'likedBy' | 'isPublic'>) => {
  try {
    const docRef = await addDoc(complimentsCollection, {
      ...compliment,
      createdAt: serverTimestamp(),
      isPublic: false,
      likeCount: 0,
      likedBy: []
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving compliment:", error);
    throw error;
  }
};

export const getUserCompliments = async (userId: string) => {
  try {
    const q = query(
      complimentsCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Compliment));
  } catch (error) {
    console.error("Error getting user compliments:", error);
    throw error;
  }
};

export const getPublicCompliments = async () => {
  try {
    const q = query(
      complimentsCollection,
      where("isPublic", "==", true),
      orderBy("likeCount", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Compliment));
  } catch (error) {
    console.error("Error getting public compliments:", error);
    throw error;
  }
};

export const updateCompliment = async (id: string, updates: Partial<Compliment>) => {
  try {
    const complimentRef = doc(db, "compliments", id);
    await updateDoc(complimentRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating compliment:", error);
    throw error;
  }
};

export const deleteCompliment = async (id: string) => {
  try {
    const complimentRef = doc(db, "compliments", id);
    await deleteDoc(complimentRef);
    return true;
  } catch (error) {
    console.error("Error deleting compliment:", error);
    throw error;
  }
};

export const toggleLikeCompliment = async (complimentId: string, userId: string) => {
  try {
    // Get current compliment
    const complimentRef = doc(db, "compliments", complimentId);
    const complimentSnap = await getDoc(complimentRef);
    
    if (!complimentSnap.exists()) {
      throw new Error("Compliment not found");
    }
    
    const complimentData = complimentSnap.data() as Compliment;
    const likedBy = complimentData.likedBy || [];
    
    // Check if user already liked the compliment
    const alreadyLiked = likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike
      const updatedLikedBy = likedBy.filter(id => id !== userId);
      await updateDoc(complimentRef, {
        likedBy: updatedLikedBy,
        likeCount: updatedLikedBy.length
      });
      return false; // Indicates unliked
    } else {
      // Like
      const updatedLikedBy = [...likedBy, userId];
      await updateDoc(complimentRef, {
        likedBy: updatedLikedBy,
        likeCount: updatedLikedBy.length
      });
      return true; // Indicates liked
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Export
export { auth, db, googleProvider, facebookProvider, Timestamp };
