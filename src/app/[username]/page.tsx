"use client";

import { useState, useEffect } from "react";
import { getUserByUsername, UserData } from "@/lib/auth";
import { projectService, Project } from "@/lib/projects";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Function to format dates consistently
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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
          
          // Fetch public projects for this user
          const projectsResult = await projectService.getPublicProjects(username);
          if (projectsResult.data) {
            setProjects(projectsResult.data);
          }
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
            Member since {formatDate(new Date(user.createdAt))}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Public Projects</h2>
          
          {projects.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No public projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      <Link 
                        href={`/${username}/${project.slug}`}
                        className="hover:text-blue-600"
                      >
                        {project.name}
                      </Link>
                    </h3>
                    
                    {project.details && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.details}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                      <span>
                        {project.createdAt ? formatDate(project.createdAt.toDate()) : 'N/A'}
                      </span>
                      <Link 
                        href={`/${username}/${project.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 