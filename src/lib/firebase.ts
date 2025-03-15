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
  serverTimestamp,
  limit
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcyBLG5mcrxyEwbBsyq4xX2Hh2Es6L1Ok",
  authDomain: "portfolio-ce615.firebaseapp.com",
  projectId: "portfolio-ce615",
  storageBucket: "portfolio-ce615.appspot.com",
  messagingSenderId: "274495429625",
  appId: "1:274495429625:web:d0c6efecd41854e616fb28",
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
const usersCollection = collection(db, "users");
const commentsCollection = collection(db, "comments");

// Constants
export const ADMIN_EMAIL = "sunny.pranav2006@gmail.com";

// Types
export interface Comment {
  id?: string;
  complimentId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: Timestamp;
}

export interface Compliment {
  id?: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  isPublic: boolean;
  likeCount: number;
  likedBy: string[];
  recipient?: string;
  tone?: string;
  mood?: string;
  isSaved?: boolean;
  commentCount?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  createdAt: Timestamp;
  preferences?: {
    darkMode: boolean;
    language: string;
  };
  subscription?: {
    level: "free" | "premium";
    expiresAt: Timestamp;
  };
}

// User profile functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      return { ...(userSnap.data() as UserProfile), uid: userSnap.id };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const userDoc = doc(db, "users", profile.uid);
    await updateDoc(userDoc, { ...profile });
    return profile;
  } catch (error) {
    // If document doesn't exist, create it
    try {
      const userDoc = doc(db, "users", profile.uid);
      await updateDoc(userDoc, { ...profile });
      return profile;
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(doc => ({
      ...(doc.data() as UserProfile),
      uid: doc.id
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

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
      ...doc.data(),
      isSaved: true
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

// Add toggleSaveCompliment function for History.tsx
export const toggleSaveCompliment = async (complimentId: string, isSaved: boolean) => {
  try {
    const complimentRef = doc(db, "compliments", complimentId);
    await updateDoc(complimentRef, { isSaved });
    return true;
  } catch (error) {
    console.error("Error toggling save state:", error);
    throw error;
  }
};

// Comment functions
export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
  try {
    // Add the comment
    const docRef = await addDoc(commentsCollection, {
      ...comment,
      createdAt: serverTimestamp()
    });
    
    // Update the comment count on the compliment
    const complimentRef = doc(db, "compliments", comment.complimentId);
    const complimentSnap = await getDoc(complimentRef);
    
    if (complimentSnap.exists()) {
      const complimentData = complimentSnap.data() as Compliment;
      const currentCount = complimentData.commentCount || 0;
      
      await updateDoc(complimentRef, {
        commentCount: currentCount + 1
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComplimentComments = async (complimentId: string) => {
  try {
    const q = query(
      commentsCollection,
      where("complimentId", "==", complimentId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string, complimentId: string) => {
  try {
    // Delete the comment
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
    
    // Update the comment count on the compliment
    const complimentRef = doc(db, "compliments", complimentId);
    const complimentSnap = await getDoc(complimentRef);
    
    if (complimentSnap.exists()) {
      const complimentData = complimentSnap.data() as Compliment;
      const currentCount = complimentData.commentCount || 0;
      
      await updateDoc(complimentRef, {
        commentCount: Math.max(0, currentCount - 1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Export
export { auth, db, googleProvider, facebookProvider, Timestamp };
