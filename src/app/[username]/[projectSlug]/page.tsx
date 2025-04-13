"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { projectService, Project } from "@/lib/projects";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function ProjectPage() {
  const { username, projectSlug } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  // Format date using native JavaScript
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    async function loadProject() {
      if (!username || !projectSlug || typeof username !== 'string' || typeof projectSlug !== 'string') {
        setError("Invalid URL parameters");
        setLoading(false);
        return;
      }

      try {
        const result = await projectService.getProjectBySlug(username, projectSlug);
        
        if (result.error) {
          console.error("Error fetching project:", result.error);
          if (result.error.message.includes("not found")) {
            setNotFound(true);
          } else {
            setError(`Failed to load project: ${result.error.message}`);
          }
        } else if (result.data) {
          // Check if project is public or user is the owner
          if (result.data.isPublic || (user && user.uid === result.data.ownerUid)) {
            setProject(result.data);
          } else {
            // Private project and user is not the owner
            setForbidden(true);
          }
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("An unexpected error occurred while loading the project.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [username, projectSlug, user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            The project &quot;{projectSlug}&quot; by user &quot;{username}&quot; does not exist or may have been deleted.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href={`/${username}`} className="text-blue-600 hover:underline">
              View {username}&apos;s profile
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Private Project</h1>
          <p className="text-gray-600 mb-6">
            This project is private and can only be viewed by its owner.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href={`/${username}`} className="text-blue-600 hover:underline">
              View {username}&apos;s profile
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center mt-2">
                <Link href={`/${username}`} className="text-blue-600 hover:underline">
                  @{username}
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-500 text-sm">
                  {project.createdAt ? formatDate(project.createdAt.toDate()) : 'N/A'}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {project.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Show edit button if user is the owner */}
            {user && user.uid === project.ownerUid && (
              <Link
                href={`/projects/${project.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Project
              </Link>
            )}
          </div>

          {project.archived && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded mb-6">
              <p className="font-medium text-amber-800">This project has been archived</p>
              {project.archiveReason && (
                <p className="text-amber-700 mt-1 text-sm">{project.archiveReason}</p>
              )}
            </div>
          )}

          {project.details && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About this project</h2>
              <div className="text-gray-700 prose prose-sm max-w-none">
                {project.details.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {project.estimatedTime && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Estimated Timeline</h3>
                <p className="text-gray-600">{project.estimatedTime}</p>
              </div>
            )}
            
            {project.availableTime && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Available Time</h3>
                <p className="text-gray-600">{project.availableTime}</p>
              </div>
            )}
            
            {project.timeline && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Timeline</h3>
                <p className="text-gray-600">{project.timeline}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 