"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      const result = await signOut();
      
      if (result.success) {
        // Redirect to home page after sign out
        router.push("/");
      } else {
        console.error("Sign out failed:", result.error);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-sm text-gray-800 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
      aria-label="Sign out"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
} 