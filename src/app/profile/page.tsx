"use client";

import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import Link from "next/link";

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
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 rounded-md border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <Link
                        href={`/${userData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                      >
                        {typeof window !== 'undefined' ? `${window.location.origin}/${userData.username}` : ''}
                      </Link>
                    </div>
                    <button
                      onClick={copyProfileLink}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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