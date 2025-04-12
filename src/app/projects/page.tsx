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

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <Link
            href="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create New Project
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first project to start tracking your progress.
            </p>
            <Link
              href="/projects/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                  project.archived ? 'opacity-75 border-gray-200' : 'border-gray-200 hover:border-blue-300'
                } transition`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold">
                      <Link 
                        href={`/projects/${project.id}`} 
                        className={`hover:text-blue-600 ${project.archived ? 'text-gray-500' : ''}`}
                      >
                        {project.name}
                      </Link>
                    </h2>
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
                  
                  {project.details && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.details}
                    </p>
                  )}
                  
                  {project.archived && (
                    <div className="bg-gray-100 px-3 py-2 text-sm rounded mb-3">
                      <span className="font-medium">Archived</span>
                      {project.archiveReason && (
                        <p className="text-gray-600 text-xs mt-1">
                          Reason: {project.archiveReason}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <span>
                      Created: {project.createdAt ? new Date(project.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </span>
                    <Link 
                      href={`/projects/${project.id}`} 
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
    </ProtectedRoute>
  );
} 