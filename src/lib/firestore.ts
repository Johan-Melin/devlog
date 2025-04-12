import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  DocumentData,
  DocumentSnapshot,
  WhereFilterOp
} from 'firebase/firestore';
import { db } from './firebase';

// Error handler wrapper
const handleFirestoreError = async <T>(operation: () => Promise<T>): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    console.error('Firestore operation failed:', error);
    return { data: null, error: error as Error };
  }
};

// Test function to fetch a document
export const fetchTestDocument = async (collectionName: string, docId: string) => {
  return handleFirestoreError(async () => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  });
};

// Create a test document
export const createTestDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  return handleFirestoreError(async () => {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
    return { id: docId, ...data };
  });
};

// Generic firestore operations that will be useful later
export const firestoreService = {
  // Create a document with auto-generated ID
  create: async (collectionName: string, data: DocumentData) => {
    return handleFirestoreError(async () => {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return { id: docRef.id, ...data };
    });
  },
  
  // Create a document with specific ID
  createWithId: async (collectionName: string, docId: string, data: DocumentData) => {
    return handleFirestoreError(async () => {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);
      return { id: docId, ...data };
    });
  },
  
  // Get a document by ID
  getById: async (collectionName: string, docId: string) => {
    return handleFirestoreError(async () => {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    });
  },
  
  // Update a document
  update: async (collectionName: string, docId: string, data: Partial<DocumentData>) => {
    return handleFirestoreError(async () => {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    });
  },
  
  // Delete a document
  delete: async (collectionName: string, docId: string) => {
    return handleFirestoreError(async () => {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    });
  },
  
  // Query documents
  query: async (collectionName: string, fieldPath: string, opStr: WhereFilterOp, value: unknown) => {
    return handleFirestoreError(async () => {
      const q = query(collection(db, collectionName), where(fieldPath, opStr, value));
      const querySnapshot = await getDocs(q);
      
      const results: Array<DocumentData & { id: string }> = [];
      querySnapshot.forEach((docSnapshot: DocumentSnapshot) => {
        results.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      
      return results;
    });
  }
}; 