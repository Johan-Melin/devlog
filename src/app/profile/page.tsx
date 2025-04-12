"use client";

import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

export default function Profile() {
  const { userData } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyProfileLink = () => {
    if (!userData) return;
    
    const url = `${window.location.origin}/${userData.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          {userData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                <div className="mt-4 border rounded-md p-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="mt-1 text-md text-gray-900">@{userData.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-md text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Created</p>
                      <p className="mt-1 text-md text-gray-900">
                        {new Date(userData.createdAt).toLocaleDateString()} 
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Public Profile</h2>
                <div className="mt-4 border rounded-md p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-3">
                    Share your public profile to let others see your public projects:
                  </p>
                  <div className="flex items-center">
                    <code className="bg-gray-100 p-2 rounded-l text-sm flex-1 truncate">
                      {typeof window !== 'undefined' ? `${window.location.origin}/${userData.username}` : ''}
                    </code>
                    <button
                      onClick={copyProfileLink}
                      className="bg-blue-600 text-white py-2 px-4 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 