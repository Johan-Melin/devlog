"use client";

import { useState, useEffect } from "react";
import { getUserByUsername, UserData } from "@/lib/auth";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!username || typeof username !== 'string') {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const userResult = await getUserByUsername(username);
        
        if (userResult.data) {
          setUser(userResult.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto my-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto my-20 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-8">
          The user &quot;{username}&quot; does not exist.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">@{username}&apos;s Profile</h1>
          <p className="text-gray-600">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Public Projects</h2>
          
          {/* This would be populated with actual projects in Step 6 */}
          <div className="py-8 text-center text-gray-500">
            <p>No public projects yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 