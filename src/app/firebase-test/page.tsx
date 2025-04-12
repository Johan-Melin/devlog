"use client";

import { useState } from "react";
import { createTestDocument, fetchTestDocument } from "@/lib/firestore";
import { DocumentData } from "firebase/firestore";

export default function FirebaseTestPage() {
  const [testData, setTestData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testCollection = "test-collection";
  const testDocId = "test-document";
  const testDocData = {
    name: "Test Document",
    description: "This is a test document for Firebase integration",
    timestamp: new Date().toISOString(),
  };

  const handleCreateTestDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await createTestDocument(testCollection, testDocId, testDocData);
      console.log("Document created:", result);
      setTestData(result.data);
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create test document. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTestDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTestDocument(testCollection, testDocId);
      console.log("Document fetched:", result);
      setTestData(result.data);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError("Failed to fetch test document. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-8">Firebase Integration Test</h1>
        
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={handleCreateTestDocument}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            Create Test Document
          </button>
          
          <button
            onClick={handleFetchTestDocument}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            Fetch Test Document
          </button>
        </div>
        
        {loading && <p className="text-gray-500">Loading...</p>}
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}
        
        {testData && (
          <div className="p-4 bg-gray-400 rounded">
            <h2 className="font-bold mb-2">Test Document Data:</h2>
            <pre className="text-xs overflow-auto p-2 bg-gray-500 rounded">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-500 border border-yellow-400 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Before testing, make sure to:
          </p>
          <ol className="list-decimal list-inside text-sm mt-2">
            <li>Create a Firebase project in the Firebase Console</li>
            <li>Enable Firestore in the Database section</li>
            <li>Update your .env.local file with your Firebase project credentials</li>
          </ol>
        </div>
      </div>
    </main>
  );
} 