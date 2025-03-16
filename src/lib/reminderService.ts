
import { db, Timestamp } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import { sendEmail } from "./emailService";

export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  date: Date | Timestamp;
  email: string;
  reminderSent: boolean;
  createdAt: Timestamp;
}

// Create a new reminder
export const addReminder = async (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'reminderSent'>) => {
  try {
    const remindersRef = collection(db, "reminders");
    const newReminder = {
      ...reminderData,
      reminderSent: false,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(remindersRef, newReminder);
    return { id: docRef.id, ...newReminder };
  } catch (error) {
    console.error("Error adding reminder:", error);
    throw error;
  }
};

// Get all reminders for a user
export const getUserReminders = async (userId: string) => {
  try {
    const remindersRef = collection(db, "reminders");
    const q = query(
      remindersRef, 
      where("userId", "==", userId),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const reminders: Reminder[] = [];
    
    querySnapshot.forEach((doc) => {
      reminders.push({ id: doc.id, ...doc.data() } as Reminder);
    });
    
    return reminders;
  } catch (error) {
    console.error("Error getting reminders:", error);
    throw error;
  }
};

// Update a reminder
export const updateReminder = async (reminderId: string, updatedData: Partial<Reminder>) => {
  try {
    const reminderRef = doc(db, "reminders", reminderId);
    await updateDoc(reminderRef, updatedData);
    return { id: reminderId, ...updatedData };
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
};

// Delete a reminder
export const deleteReminder = async (reminderId: string) => {
  try {
    const reminderRef = doc(db, "reminders", reminderId);
    await deleteDoc(reminderRef);
    return true;
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
};

// Send a reminder email
export const sendReminderEmail = async (reminder: Reminder) => {
  try {
    const emailData = {
      to: reminder.email,
      subject: `Reminder: ${reminder.title}`,
      body: `
        <h1>Anniversary Reminder</h1>
        <p>Hello,</p>
        <p>This is a reminder for your upcoming event: <strong>${reminder.title}</strong></p>
        ${reminder.description ? `<p>${reminder.description}</p>` : ''}
        <p>Date: ${reminder.date instanceof Timestamp ? 
          new Date(reminder.date.toMillis()).toLocaleDateString() : 
          new Date(reminder.date).toLocaleDateString()
        }</p>
        <p>We hope you have a wonderful celebration!</p>
        <p>Best regards,<br>LoverPrompt Team</p>
      `
    };
    
    await sendEmail(emailData);
    
    // Mark the reminder as sent
    if (reminder.id) {
      await updateReminder(reminder.id, { reminderSent: true });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};
