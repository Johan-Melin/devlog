import { 
    getAuth, 
    onAuthStateChanged as _onAuthStateChanged,
    onIdTokenChanged as _onIdTokenChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as _signOut,
    User,
    UserCredential,
    NextOrObserver
  } from 'firebase/auth';
  import { app } from './config';
  
  // Initialize Firebase Auth
  const auth = getAuth(app);
  
  // Listen to auth state changes
  export function onAuthStateChanged(callback: NextOrObserver<User>) {
    return _onAuthStateChanged(auth, callback);
  }
  
  // Listen to ID token changes
  export function onIdTokenChanged(callback: NextOrObserver<User>) {
    return _onIdTokenChanged(auth, callback);
  }
  
  // Sign in with email/password
  export async function signInWithEmail(
    email: string, 
    password: string
  ): Promise<UserCredential | undefined> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email/password", error);
      return undefined;
    }
  }
  
  // Create a new user with email/password
  export async function createUserWithEmail(
    email: string, 
    password: string
  ): Promise<UserCredential | undefined> {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error creating user with email/password", error);
      return undefined;
    }
  }
  
  // Sign out
  export async function signOut(): Promise<void> {
    try {
      return await _signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }
  
  // Export auth instance
  export { auth };
  export type { User };