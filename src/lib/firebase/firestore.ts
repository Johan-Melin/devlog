import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from './config'; 

// Initialize Firestore
const db = getFirestore(app);

// User profile functions
interface UserProfileData {
  name: string;
  email: string;
  age?: number; // Example optional field
  [key: string]: unknown; // Allow additional fields if necessary
}

export async function createUserProfile(userId: string, data: UserProfileData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfileData>) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Export Firestore instance
export { db };