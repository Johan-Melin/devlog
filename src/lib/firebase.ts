import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  Firestore, 
  initializeFirestore, 
  CACHE_SIZE_UNLIMITED, 
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0]; // if already initialized, use that one
}

// Initialize Firestore with persistent cache
// This replaces the deprecated enableIndexedDbPersistence
const db: Firestore = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ 
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager()
  })
});

export { db }; 