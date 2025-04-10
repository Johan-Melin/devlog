'use client';

import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>('Checking Firebase connection...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function testFirebase() {
      try {
        // Test if Firebase app is initialized
        if (app) {
          setStatus('Firebase app initialized successfully!');
          
          // Optional: Try to connect to Firestore
          try {
            const db = getFirestore(app);
            // Try to get a collection (it's okay if it doesn't exist)
            await getDocs(collection(db, 'test'));
            setStatus('Firebase app initialized and Firestore connection successful!');
          } catch (err) {
            console.error('Firestore error:', err);
            setStatus('Firebase app initialized but Firestore error occurred.');
            setError(err instanceof Error ? err.message : 'Unknown error');
          }
        } else {
          setStatus('Firebase app failed to initialize.');
        }
      } catch (err) {
        console.error('Firebase initialization error:', err);
        setStatus('Error initializing Firebase.');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    testFirebase();
  }, []);
  
  return (
    <div className="p-4 border rounded-lg my-4">
      <h2 className="text-xl font-bold mb-2">Firebase Connection Test</h2>
      <p className="mb-2">Status: <span className={error ? 'text-red-500' : 'text-green-500'}>{status}</span></p>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}