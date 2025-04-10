"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className = '' }: SignOutButtonProps) {
  const { logOut } = useAuth();  // Changed from signOut to logOut to match your context
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logOut();  // Changed from signOut to logOut
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${className}`}
    >
      Sign Out
    </button>
  );
}