"use client";

import { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmail, 
  createUserWithEmail, 
  signOut 
} from "@/app/lib/firebase/auth";

export default function AuthComponent() {
  const [user, setUser] = useState<unknown>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log("Auth state changed:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    setStatus("Attempting to create user...");
    try {
      const result = await createUserWithEmail(email, password);
      setStatus(result ? "User created successfully!" : "Failed to create user");
      console.log("Sign up result:", result);
    } catch (error) {
      setStatus(`Error: ${error}`);
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    setStatus("Attempting to sign in...");
    try {
      const result = await signInWithEmail(email, password);
      setStatus(result ? "Sign in successful!" : "Failed to sign in");
      console.log("Sign in result:", result);
    } catch (error) {
      setStatus(`Error: ${error}`);
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    setStatus("Attempting to sign out...");
    try {
      await signOut();
      setStatus("Sign out successful!");
    } catch (error) {
      setStatus(`Error: ${error}`);
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Authentication</h2>
      
      <div className="mb-6 p-4 border rounded">
        <h3 className="mb-2 text-gray-800 font-medium">Current User:</h3>
        <pre className="bg-gray-100 p-2 rounded text-gray-800 overflow-auto max-h-60 text-sm">
          {user ? JSON.stringify(user, null, 2) : "No user signed in"}
        </pre>
      </div>
      
      {!user ? (
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded text-gray-800"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded text-gray-800"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSignUp}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sign Up
              </button>
              <button
                onClick={handleSignIn}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSignOut}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      )}
      
      {status && (
        <div className="mt-4">
          <div className="p-2 bg-gray-100 rounded text-gray-800 overflow-auto max-h-40 break-all">
            {status}
          </div>
        </div>
      )}
    </div>
  );
}