"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/projects";
import { projectService } from "@/lib/projects";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProjectCard from '@/components/ProjectCard';
import { getCurrentUserData } from "@/lib/auth";
import { UserData } from "@/lib/auth";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userResult = await getCurrentUserData();
        if (!userResult.data) {
          setError('You must be logged in to view projects');
          setLoading(false);
          return;
        }
        setUserData(userResult.data);
        const projectsResult = await projectService.getUserProjects(userResult.data.uid);
        if (projectsResult.data) {
          setProjects(projectsResult.data);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const activeProjects = projects.filter(p => p.status === 'active');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const archivedProjects = projects.filter(p => p.status === 'archived');

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            {activeProjects.length > 0 && userData && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Active Projects</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      username={userData.username}
                      showEditButton
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Projects */}
            {upcomingProjects.length > 0 && userData && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Projects</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      username={userData.username}
                      showEditButton
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Projects */}
            {completedProjects.length > 0 && userData && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Projects</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      username={userData.username}
                      showEditButton
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Archived Projects */}
            {archivedProjects.length > 0 && userData && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Archived Projects</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {archivedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      username={userData.username}
                      showEditButton
                    />
                  ))}
                </div>
              </div>
            )}

            {activeProjects.length === 0 && upcomingProjects.length === 0 && completedProjects.length === 0 && archivedProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-700">No projects found. Create your first project to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 