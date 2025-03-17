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
  setDoc,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Collection references
const complimentsCollection = collection(db, "compliments");
const usersCollection = collection(db, "users");
const commentsCollection = collection(db, "comments");
const timelineEventsCollection = collection(db, "timelineEvents");
const remindersCollection = collection(db, "reminders");

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
  userDisplayName?: string;
  userPhotoURL?: string;
  userSubscription?: {
    level: "free" | "premium";
    expiresAt?: Timestamp;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bannerURL?: string;
  createdAt: Timestamp;
  bio?: string;
  location?: string;
  birthdate?: Timestamp;
  interests?: string[];
  preferences?: {
    darkMode: boolean;
    language: string;
  };
  subscription?: {
    level: "free" | "premium";
    expiresAt: Timestamp;
  };
  followersCount?: number;
  followingCount?: number;
  isPrivate?: boolean;
}

export interface TimelineEvent {
  id?: string;
  userId: string;
  title: string;
  date: string; // ISO date string
  description: string;
  imageUrl?: string;
  color?: string;
  iconColor?: string;
  borderColor?: string;
  createdAt: Timestamp;
  isPublic: boolean;
}

export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  date: string; // ISO date string
  type: "anniversary" | "birthday" | "special";
  reminderDays: number[]; // Days before to remind
  notes?: string;
  notificationMethod: ("app" | "email" | "sms")[];
  createdAt: Timestamp;
  lastReminded?: Timestamp;
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

export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      return { ...(userSnap.data() as UserProfile), uid: userSnap.id };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const userDoc = doc(db, "users", profile.uid);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      // Update existing document
      await updateDoc(userDoc, { ...profile });
    } else {
      // Create new document if it doesn't exist
      await setDoc(userDoc, { ...profile });
    }
    
    return profile;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
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

// Timeline functions
export const addTimelineEvent = async (event: Omit<TimelineEvent, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(timelineEventsCollection, {
      ...event,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

export const updateTimelineEvent = async (id: string, updates: Partial<TimelineEvent>): Promise<boolean> => {
  try {
    const eventRef = doc(db, "timelineEvents", id);
    await updateDoc(eventRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

export const deleteTimelineEvent = async (id: string): Promise<boolean> => {
  try {
    const eventRef = doc(db, "timelineEvents", id);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};

export const getTimelineEvents = async (userId: string): Promise<TimelineEvent[]> => {
  try {
    const q = query(
      timelineEventsCollection,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as TimelineEvent)
    }));
  } catch (error) {
    console.error("Error getting timeline events:", error);
    throw error;
  }
};

export const getPublicTimelineEvents = async (): Promise<TimelineEvent[]> => {
  try {
    const q = query(
      timelineEventsCollection,
      where("isPublic", "==", true),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as TimelineEvent)
    }));
  } catch (error) {
    console.error("Error getting public timeline events:", error);
    throw error;
  }
};

// Upload image function
export const uploadTimelineImage = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `timeline/${userId}/${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Reminder functions
export const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(remindersCollection, {
      ...reminder,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding reminder:", error);
    throw error;
  }
};

export const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<boolean> => {
  try {
    const reminderRef = doc(db, "reminders", id);
    await updateDoc(reminderRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
};

export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    const reminderRef = doc(db, "reminders", id);
    await deleteDoc(reminderRef);
    return true;
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
};

export const getUserReminders = async (userId: string): Promise<Reminder[]> => {
  try {
    const q = query(
      remindersCollection,
      where("userId", "==", userId),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Reminder)
    }));
  } catch (error) {
    console.error("Error getting user reminders:", error);
    throw error;
  }
};

export const getUpcomingReminders = async (userId: string, days: number = 30): Promise<Reminder[]> => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const q = query(
      remindersCollection,
      where("userId", "==", userId),
      where("date", ">=", todayStr),
      where("date", "<=", futureDateStr),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Reminder)
    }));
  } catch (error) {
    console.error("Error getting upcoming reminders:", error);
    throw error;
  }
};

// SendEmail function (to be triggered via Cloud Functions in a production app)
export const sendReminderEmail = async (to: string, subject: string, message: string) => {
  // In a real app, you would use Firebase Cloud Functions 
  // to securely send emails via a service like Sendgrid or Mailgun
  
  // For demo purposes, we'll simulate email sending
  console.log(`Sending email to ${to}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // Return success to simulate email sent
  return true;
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

// Follow system functions
export const followUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  try {
    // Add to following collection for current user
    const followingRef = doc(db, "following", currentUserId, "users", targetUserId);
    await setDoc(followingRef, { timestamp: serverTimestamp() });
    
    // Add to followers collection for target user
    const followerRef = doc(db, "followers", targetUserId, "users", currentUserId);
    await setDoc(followerRef, { timestamp: serverTimestamp() });
    
    // Update follower and following counts
    await updateFollowCounts(currentUserId, targetUserId);
    
    return true;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  try {
    // Remove from following collection for current user
    const followingRef = doc(db, "following", currentUserId, "users", targetUserId);
    await deleteDoc(followingRef);
    
    // Remove from followers collection for target user
    const followerRef = doc(db, "followers", targetUserId, "users", currentUserId);
    await deleteDoc(followerRef);
    
    // Update follower and following counts
    await updateFollowCounts(currentUserId, targetUserId);
    
    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const isFollowing = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  try {
    const followingRef = doc(db, "following", currentUserId, "users", targetUserId);
    const docSnap = await getDoc(followingRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

export const getFollowers = async (userId: string): Promise<UserProfile[]> => {
  try {
    const followersRef = collection(db, "followers", userId, "users");
    const querySnapshot = await getDocs(followersRef);
    
    const followers: UserProfile[] = [];
    const fetchPromises: Promise<void>[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const fetchPromise = getUserProfile(doc.id).then(followerProfile => {
        if (followerProfile) {
          followers.push(followerProfile);
        }
      });
      fetchPromises.push(fetchPromise);
    });
    
    await Promise.all(fetchPromises);
    return followers;
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
};

export const getFollowing = async (userId: string): Promise<UserProfile[]> => {
  try {
    const followingRef = collection(db, "following", userId, "users");
    const querySnapshot = await getDocs(followingRef);
    
    const following: UserProfile[] = [];
    const fetchPromises: Promise<void>[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const fetchPromise = getUserProfile(doc.id).then(followingProfile => {
        if (followingProfile) {
          following.push(followingProfile);
        }
      });
      fetchPromises.push(fetchPromise);
    });
    
    await Promise.all(fetchPromises);
    return following;
  } catch (error) {
    console.error("Error getting following:", error);
    return [];
  }
};

export const getFollowCounts = async (userId: string): Promise<{followers: number, following: number}> => {
  try {
    const followersRef = collection(db, "followers", userId, "users");
    const followingRef = collection(db, "following", userId, "users");
    
    const [followersSnapshot, followingSnapshot] = await Promise.all([
      getDocs(followersRef),
      getDocs(followingRef)
    ]);
    
    return {
      followers: followersSnapshot.size,
      following: followingSnapshot.size
    };
  } catch (error) {
    console.error("Error getting follow counts:", error);
    return { followers: 0, following: 0 };
  }
};

const updateFollowCounts = async (currentUserId: string, targetUserId: string): Promise<void> => {
  try {
    // Get current counts
    const currentUserCounts = await getFollowCounts(currentUserId);
    const targetUserCounts = await getFollowCounts(targetUserId);
    
    // Update current user's following count
    const currentUserRef = doc(db, "users", currentUserId);
    await updateDoc(currentUserRef, {
      followingCount: currentUserCounts.following
    });
    
    // Update target user's follower count
    const targetUserRef = doc(db, "users", targetUserId);
    await updateDoc(targetUserRef, {
      followersCount: targetUserCounts.followers
    });
  } catch (error) {
    console.error("Error updating follow counts:", error);
  }
};

export const getFollowingCompliments = async (userId: string): Promise<Compliment[]> => {
  try {
    // Get list of users the current user is following
    const followingRef = collection(db, "following", userId, "users");
    const followingSnapshot = await getDocs(followingRef);
    
    if (followingSnapshot.empty) {
      return [];
    }
    
    const followingIds = followingSnapshot.docs.map(doc => doc.id);
    
    // Get compliments from those users
    const q = query(
      complimentsCollection,
      where("userId", "in", followingIds),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Compliment));
  } catch (error) {
    console.error("Error getting following compliments:", error);
    return [];
  }
};

// Export
export { auth, db, googleProvider, facebookProvider, Timestamp, storage };