"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, userData, loading } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userData?.username || "user"}!</h1>
            <p className="text-gray-600">
              Track your project progress and identify recurring blockers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold mb-3">Your Projects</h2>
              <p className="text-gray-600 mb-4">
                Manage and track all your development projects in one place.
              </p>
              <Link
                href="/projects"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                View Projects
              </Link>
            </div>

            <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
              <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
              <p className="text-gray-600 mb-4">
                Manage your account settings and view your public profile.
              </p>
              <Link
                href="/profile"
                className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
              >
                View Profile
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a new project from the Projects page</li>
              <li>Add log entries to track your progress</li>
              <li>Tag your blockers to identify patterns</li>
              <li>Review your logs to improve productivity</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold mb-4">Track Your Project Progress</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            DevLog helps you identify recurring blockers and time wasters in your development projects.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Create an Account
            </Link>
            <Link
              href="/signin"
              className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
            >
              Sign In
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Log your daily development activities and track your progress over time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-3">🚧</div>
              <h3 className="text-lg font-semibold mb-2">Identify Blockers</h3>
              <p className="text-gray-600">
                Tag and categorize blockers to identify patterns that slow you down.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-blue-600 text-2xl mb-3">⏱️</div>
              <h3 className="text-lg font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Learn from past challenges to improve your productivity going forward.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
