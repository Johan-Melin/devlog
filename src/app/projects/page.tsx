"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { createProject, getUserProjects } from "@/lib/firebase/firestore";
import SignOutButton from '@/components/SignOutButton';
import { Project } from '@/types/project';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load projects when component mounts
  useEffect(() => {
    async function loadProjects() {
      if (user) {
        setIsLoading(true);
        try {
          const userProjects = await getUserProjects(user.uid);
          setProjects(userProjects);
        } catch (error) {
          console.error("Failed to load projects:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (user) {
      loadProjects();
    }
  }, [user]);

  // Handle project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setFormError('Project title is required');
      return;
    }

    if (!user) return;
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const newProject = await createProject(user.uid, {
        title,
        description,
      });
      
      if (newProject) {
        // Reset form
        setTitle('');
        setDescription('');
        setShowCreateForm(false);
        
        // Add new project to list
        setProjects(prevProjects => [...prevProjects, newProject]);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setFormError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Project
          </button>
          <SignOutButton />
        </div>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            
            {formError && (
              <div className="p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No projects created</h2>
          <p className="text-gray-600 mb-6">Get started by creating your first project</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h2>
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}