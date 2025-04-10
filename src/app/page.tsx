"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to projects page
  useEffect(() => {
    if (!loading && user) {
      router.push('/projects');
    }
  }, [user, loading, router]);

  // If loading or user is authenticated (will redirect), show loading state
  if (loading || user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">DevLog</h1>
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show auth form for non-authenticated users
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">DevLog</h1>
        
        <div className="mb-8">
          <AuthForm />
        </div>
        
        <p className="text-center mt-8 text-gray-600">
          Track your development progress with DevLog
        </p>
      </div>
    </main>
  );
}