"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { projectService, Project } from "@/lib/projects";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      try {
        const result = await projectService.getUserProjects(user.uid);
        
        if (result.error) {
          setError(`Failed to load projects: ${result.error.message}`);
        } else if (result.data) {
          setProjects(result.data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("An unexpected error occurred while loading projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const activeProjects = projects.filter(p => p.status === 'active');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Project
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Projects */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Active Projects</h2>
              {activeProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors duration-200"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {project.details?.substring(0, 100) || "No description"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Created {project.createdAt?.toDate().toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
                  <p>No active projects yet.</p>
                </div>
              )}
            </div>

            {/* Upcoming Projects */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Projects</h2>
              {upcomingProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors duration-200"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {project.details?.substring(0, 100) || "No description"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Created {project.createdAt?.toDate().toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
                  <p>No upcoming projects yet.</p>
                </div>
              )}
            </div>

            {/* Completed Projects */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Projects</h2>
              {completedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors duration-200"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {project.details?.substring(0, 100) || "No description"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Created {project.createdAt?.toDate().toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
                  <p>No completed projects yet.</p>
                </div>
              )}
            </div>

            {/* Archived Projects */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Archived Projects</h2>
              {archivedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {archivedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors duration-200"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {project.details?.substring(0, 100) || "No description"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Created {project.createdAt?.toDate().toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
                  <p>No archived projects yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 