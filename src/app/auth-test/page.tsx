"use client";

import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';

export default function UserCheck() {
  const { user, loading } = useAuth();

  return (
    <div className="p-6 max-w-lg mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Authentication Check</h1>
      
      {loading ? (
        <p>Checking authentication...</p>
      ) : (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl mb-2 text-gray-800">Authentication Status:</h2>
          <pre className="bg-gray-100 p-2 rounded text-gray-800 overflow-auto max-h-60 text-sm">
            {user ? JSON.stringify(user, null, 2) : "No user signed in"}
          </pre>
        </div>
      )}

      <div className="flex space-x-4 mt-8">
        <Link 
          href="/"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Home
        </Link>
        <Link 
          href="/auth-test" 
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Auth Test
        </Link>
      </div>
    </div>
  );
}