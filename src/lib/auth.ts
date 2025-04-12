import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { firestoreService } from './firestore';

// Initialize Firebase Auth
const auth = getAuth();

// User type with additional fields
export interface UserData {
  uid: string;
  email: string | null;
  username: string;
  createdAt: string;
  displayName?: string;
  photoURL?: string;
}

// Error handler wrapper similar to firestore.ts
const handleAuthError = async <T>(operation: () => Promise<T>): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    console.error('Auth operation failed:', error);
    return { data: null, error: error as Error };
  }
};

// Check if a username is already taken
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const result = await firestoreService.query('users', 'username', '==', username);
  return result.data !== null && result.data.length > 0;
};

// Create a new user with email, password, and username
export const signUp = async (email: string, password: string, username: string): Promise<{ data: UserData | null; error: Error | null }> => {
  return handleAuthError(async () => {
    // First check if username is already taken
    const usernameTaken = await isUsernameTaken(username);
    if (usernameTaken) {
      throw new Error('Username is already taken');
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      username,
      createdAt: new Date().toISOString(),
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    // Also create a username-to-uid mapping for easy lookups
    await setDoc(doc(db, 'usernames', username), {
      uid: user.uid
    });

    return userData;
  });
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<{ data: User | null; error: Error | null }> => {
  return handleAuthError(async () => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Set a session cookie on the client side
    localStorage.setItem('session', 'true');
    
    return userCredential.user;
  });
};

// Sign out
export const signOut = async (): Promise<{ success: boolean; error: Error | null }> => {
  return handleAuthError(async () => {
    await firebaseSignOut(auth);
    
    // Clear the session
    localStorage.removeItem('session');
    
    return true;
  }).then(result => ({
    success: result.data !== null,
    error: result.error
  }));
};

// Get current user data from Firestore
export const getCurrentUserData = async (): Promise<{ data: UserData | null; error: Error | null }> => {
  return handleAuthError(async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    } else {
      return null;
    }
  });
};

// Get user by username
export const getUserByUsername = async (username: string): Promise<{ data: UserData | null; error: Error | null }> => {
  return handleAuthError(async () => {
    const usernameDoc = await getDoc(doc(db, 'usernames', username));
    
    if (!usernameDoc.exists()) return null;
    
    const { uid } = usernameDoc.data();
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      return null;
    }
  });
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current auth user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 