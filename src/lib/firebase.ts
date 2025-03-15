import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp, 
  deleteDoc,
  limit,
  startAfter,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Export Timestamp for use in other files
export { Timestamp };

// Firestore collections
export const usersCollection = collection(db, "users");
export const complimentsCollection = collection(db, "compliments");
export const subscriptionsCollection = collection(db, "subscriptions");
export const storiesCollection = collection(db, "stories");

// Admin email
export const ADMIN_EMAIL = "sunny.pranav2006@gmail.com";

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
  isPublic?: boolean;
  likeCount?: number;
  likedBy?: string[];
}

export interface Comment {
  id?: string;
  userId: string;
  displayName: string;
  photoURL: string;
  content: string;
  createdAt: Timestamp;
}

export interface Story {
  id?: string;
  userId: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  createdAt: Timestamp;
  likeCount: number;
  likedBy: string[];
  commentCount: number;
}

export async function saveUserProfile(user: UserProfile) {
  try {
    if (!user || !user.uid) {
      console.error("Invalid user object provided to saveUserProfile:", user);
      throw new Error("Invalid user object: missing uid");
    }
    
    const userToSave = { ...user };
    
    if (!userToSave.preferences) {
      userToSave.preferences = {
        darkMode: false,
        language: "en"
      };
    } else {
      userToSave.preferences = {
        darkMode: userToSave.preferences.darkMode ?? false,
        language: userToSave.preferences.language ?? "en"
      };
    }
    
    const userRef = doc(db, "users", userToSave.uid);
    await setDoc(userRef, userToSave, { merge: true });
    
    const updatedUserSnap = await getDoc(userRef);
    return updatedUserSnap.exists() ? updatedUserSnap.data() as UserProfile : userToSave;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

export async function getUserProfile(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() as UserProfile : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const q = query(usersCollection, orderBy("displayName"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
}

export async function saveCompliment(compliment: Omit<Compliment, 'id'>) {
  const complimentToSave = {
    ...compliment,
    isPublic: compliment.isPublic ?? false,
    likeCount: compliment.likeCount ?? 0,
    likedBy: compliment.likedBy ?? []
  };
  
  const docRef = await addDoc(complimentsCollection, complimentToSave);
  return { ...complimentToSave, id: docRef.id } as Compliment;
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
    ...doc.data(),
    id: doc.id
  }) as Compliment);
}

export async function getSavedCompliments(userId: string) {
  const q = query(
    complimentsCollection,
    where("userId", "==", userId),
    where("isSaved", "==", true),
    orderBy("likeCount", "desc"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }) as Compliment);
}

export async function getPublicCompliments(limit = 20, lastVisible = null) {
  let q;
  
  if (lastVisible) {
    q = query(
      complimentsCollection,
      where("isPublic", "==", true),
      orderBy("likeCount", "desc"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(limit)
    );
  } else {
    q = query(
      complimentsCollection,
      where("isPublic", "==", true),
      orderBy("likeCount", "desc"),
      orderBy("createdAt", "desc"),
      limit(limit)
    );
  }
  
  const snapshot = await getDocs(q);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  
  const compliments = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }) as Compliment);
  
  return { compliments, lastDoc };
}

export async function deleteCompliment(complimentId: string) {
  const complimentRef = doc(db, "compliments", complimentId);
  await deleteDoc(complimentRef);
}

export async function updateCompliment(complimentId: string, data: Partial<Compliment>) {
  const complimentRef = doc(db, "compliments", complimentId);
  await updateDoc(complimentRef, data);
  
  const updatedDoc = await getDoc(complimentRef);
  return { ...updatedDoc.data(), id: updatedDoc.id } as Compliment;
}

export async function toggleLikeCompliment(complimentId: string, userId: string) {
  const complimentRef = doc(db, "compliments", complimentId);
  const complimentSnap = await getDoc(complimentRef);
  
  if (!complimentSnap.exists()) {
    throw new Error("Compliment not found");
  }
  
  const compliment = complimentSnap.data() as Compliment;
  const isLiked = compliment.likedBy?.includes(userId) ?? false;
  
  await updateDoc(complimentRef, {
    likeCount: isLiked ? increment(-1) : increment(1),
    likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
  });
  
  return !isLiked;
}

export async function createStory(story: Omit<Story, 'id' | 'likeCount' | 'likedBy' | 'commentCount'>) {
  try {
    const newStory = {
      ...story,
      likeCount: 0,
      likedBy: [],
      commentCount: 0
    };
    
    const docRef = await addDoc(storiesCollection, newStory);
    return { ...newStory, id: docRef.id };
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
}

export async function getStories(pageSize = 10, lastVisible = null) {
  try {
    let q;
    
    if (lastVisible) {
      q = query(
        storiesCollection,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(
        storiesCollection,
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(q);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Story[];
    
    return { stories, lastDoc };
  } catch (error) {
    console.error("Error getting stories:", error);
    return { stories: [], lastDoc: null };
  }
}

export async function getStoryById(storyId: string) {
  try {
    const storyRef = doc(db, "stories", storyId);
    const snapshot = await getDoc(storyRef);
    
    if (!snapshot.exists()) {
      throw new Error("Story not found");
    }
    
    return { id: snapshot.id, ...snapshot.data() } as Story;
  } catch (error) {
    console.error("Error getting story:", error);
    throw error;
  }
}

export async function toggleLikeStory(storyId: string, userId: string) {
  try {
    const storyRef = doc(db, "stories", storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      throw new Error("Story not found");
    }
    
    const story = storySnap.data() as Story;
    const isLiked = story.likedBy?.includes(userId);
    
    await updateDoc(storyRef, {
      likeCount: isLiked ? increment(-1) : increment(1),
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    
    return !isLiked;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

export async function addComment(storyId: string, comment: Omit<Comment, 'id' | 'createdAt'>) {
  try {
    const commentsRef = collection(db, "stories", storyId, "comments");
    const newComment = {
      ...comment,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(commentsRef, newComment);
    
    const storyRef = doc(db, "stories", storyId);
    await updateDoc(storyRef, {
      commentCount: increment(1)
    });
    
    return { ...newComment, id: docRef.id };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function getComments(storyId: string) {
  try {
    const commentsRef = collection(db, "stories", storyId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
}

export async function deleteStory(storyId: string) {
  try {
    const storyRef = doc(db, "stories", storyId);
    await deleteDoc(storyRef);
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}
