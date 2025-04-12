import { getUserByUsername } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;
  const userResult = await getUserByUsername(username);
  
  if (!userResult.data) {
    return {
      title: "User Not Found",
    };
  }
  
  return {
    title: `${username}'s DevLog Profile`,
    description: `View ${username}'s public development projects and progress logs.`,
  };
}

// Server component to display user profile
export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  const userResult = await getUserByUsername(username);
  
  if (!userResult.data) {
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
  
  // In a real implementation, we would fetch the user's public projects here
  // For now, we'll just display a placeholder
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">@{username}&apos;s Profile</h1>
          <p className="text-gray-600">
            Member since {new Date(userResult.data.createdAt).toLocaleDateString()}
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