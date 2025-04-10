"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const { user, loading, error, signIn, signUp, logOut, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const toggleMode = () => {
    clearError();
    setIsSignUp(!isSignUp);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (user) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-md shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Signed In</h2>
          <p className="text-gray-600">You are signed in as:</p>
          <p className="font-medium text-blue-600">{user.email}</p>
          
          {/* Optional: Show additional user info */}
          <div className="mt-3 pt-3 border-t text-sm text-gray-500">
            <p>User ID: {user.uid}</p>
            <p>Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <button
          onClick={logOut}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {isSignUp ? "Create Account" : "Sign In"}
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-gray-800"
            required
          />
        </div>

        <div className="flex flex-wrap justify-between items-center">
          <button
            type="submit"
            className={`p-2 ${
              isSignUp ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded`}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={toggleMode}
            className="p-2 text-blue-500 hover:text-blue-700"
          >
            {isSignUp ? "Already have an account?" : "Need an account?"}
          </button>
        </div>
      </form>
    </div>
  );
}