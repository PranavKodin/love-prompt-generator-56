
import { db, Timestamp } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";

export interface TimelineEvent {
  id?: string;
  userId: string;
  title: string;
  description: string;
  date: Date | Timestamp;
  imageUrl?: string;
  location?: string;
  isPublic: boolean;
  createdAt: Timestamp;
}

// Create a new timeline event
export const addTimelineEvent = async (eventData: Omit<TimelineEvent, 'id' | 'createdAt'>) => {
  try {
    const eventsRef = collection(db, "timelineEvents");
    const newEvent = {
      ...eventData,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(eventsRef, newEvent);
    return { id: docRef.id, ...newEvent };
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

// Get all timeline events for a user
export const getUserTimelineEvents = async (userId: string) => {
  try {
    const eventsRef = collection(db, "timelineEvents");
    const q = query(
      eventsRef, 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const events: TimelineEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as TimelineEvent);
    });
    
    return events;
  } catch (error) {
    console.error("Error getting timeline events:", error);
    throw error;
  }
};

// Get public timeline events for a user (for viewing other profiles)
export const getPublicTimelineEvents = async (userId: string) => {
  try {
    const eventsRef = collection(db, "timelineEvents");
    const q = query(
      eventsRef, 
      where("userId", "==", userId),
      where("isPublic", "==", true),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const events: TimelineEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as TimelineEvent);
    });
    
    return events;
  } catch (error) {
    console.error("Error getting public timeline events:", error);
    throw error;
  }
};

// Update a timeline event
export const updateTimelineEvent = async (eventId: string, updatedData: Partial<TimelineEvent>) => {
  try {
    const eventRef = doc(db, "timelineEvents", eventId);
    await updateDoc(eventRef, updatedData);
    return { id: eventId, ...updatedData };
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

// Delete a timeline event
export const deleteTimelineEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "timelineEvents", eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};
