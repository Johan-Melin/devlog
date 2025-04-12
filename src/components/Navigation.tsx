"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import SignOutButton from "./SignOutButton";

export default function Navigation() {
  const pathname = usePathname();
  const { user, userData, loading } = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? "bg-gray-100" : "";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                DevLog
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === "/" ? "border-blue-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } text-sm font-medium`}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    href="/projects"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                      pathname.startsWith("/projects") ? "border-blue-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } text-sm font-medium`}
                  >
                    Projects
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {userData && (
                  <Link 
                    href={`/profile`} 
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    @{userData.username}
                  </Link>
                )}
                <SignOutButton />
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/signin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/signin")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 