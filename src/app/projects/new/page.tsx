"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { projectService } from "@/lib/projects";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Form state
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [details, setDetails] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [timeline, setTimeline] = useState("");
  const [status, setStatus] = useState<'active' | 'upcoming' | 'completed' | 'archived'>('active');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await projectService.createProject(user, {
        name,
        isPublic,
        details,
        estimatedTime,
        availableTime,
        timeline,
        status,
        archived: status === 'archived'
      });
      
      if (result.error) {
        setError(`Failed to create project: ${result.error.message}`);
      } else if (result.data) {
        // Redirect to the new project
        router.push(`/projects/${result.data.id}`);
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An unexpected error occurred while creating the project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/projects"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-2xl font-bold mt-1">Create New Project</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="My Awesome Project"
                required
                disabled={loading}
              />
            </div>
            
            {/* Project Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1">
                Project Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'upcoming' | 'completed' | 'archived')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            {/* Visibility */}
            <div>
              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-900">
                  Make this project public
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-700">
                Public projects can be viewed by anyone with your profile link.
              </p>
            </div>
            
            {/* Project Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-900 mb-1">
                Project Details
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Describe your project and its goals..."
                disabled={loading}
              />
            </div>
            
            {/* Time Estimates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-900 mb-1">
                  Estimated Time
                </label>
                <input
                  id="estimatedTime"
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 2 weeks, 20 hours"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="availableTime" className="block text-sm font-medium text-gray-900 mb-1">
                  Available Time
                </label>
                <input
                  id="availableTime"
                  type="text"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 5 hours/week"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-900 mb-1">
                Timeline
              </label>
              <input
                id="timeline"
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., Complete by June 1st"
                disabled={loading}
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 