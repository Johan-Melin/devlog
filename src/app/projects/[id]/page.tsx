"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { projectService, Project } from "@/lib/projects";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for editing
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [details, setDetails] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [timeline, setTimeline] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load project data
  useEffect(() => {
    async function fetchProject() {
      if (!user || !id || typeof id !== 'string') return;
      
      try {
        const result = await projectService.getProject(user.uid, id);
        
        if (result.error) {
          setError(`Failed to load project: ${result.error.message}`);
        } else if (result.data) {
          setProject(result.data);
          // Initialize form state with project data
          setName(result.data.name);
          setIsPublic(result.data.isPublic);
          setDetails(result.data.details || "");
          setEstimatedTime(result.data.estimatedTime || "");
          setAvailableTime(result.data.availableTime || "");
          setTimeline(result.data.timeline || "");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("An unexpected error occurred while loading the project.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [user, id]);

  // Toggle project visibility
  const toggleVisibility = async () => {
    if (!user || !project) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const result = await projectService.updateProject(user.uid, project.id, {
        isPublic: !project.isPublic
      });
      
      if (result.error) {
        setError(`Failed to update visibility: ${result.error.message}`);
      } else if (result.data) {
        setProject(result.data);
        setIsPublic(result.data.isPublic);
        showSaveSuccess();
      }
    } catch (err) {
      console.error("Error updating visibility:", err);
      setError("An unexpected error occurred while updating visibility.");
    } finally {
      setSaving(false);
    }
  };

  // Handle form submission for editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !project) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const result = await projectService.updateProject(user.uid, project.id, {
        name,
        isPublic,
        details,
        estimatedTime,
        availableTime,
        timeline
      });
      
      if (result.error) {
        setError(`Failed to update project: ${result.error.message}`);
      } else if (result.data) {
        setProject(result.data);
        setIsEditing(false);
        showSaveSuccess();
      }
    } catch (err) {
      console.error("Error updating project:", err);
      setError("An unexpected error occurred while updating the project.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing and reset form values
  const cancelEditing = () => {
    if (!project) return;
    
    setName(project.name);
    setIsPublic(project.isPublic);
    setDetails(project.details || "");
    setEstimatedTime(project.estimatedTime || "");
    setAvailableTime(project.availableTime || "");
    setTimeline(project.timeline || "");
    
    setIsEditing(false);
  };

  // Show success message temporarily
  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Delete project
  const handleDelete = async () => {
    if (!user || !project) return;
    
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const result = await projectService.deleteProject(user.uid, project.id);
      
      if (result.error) {
        setError(`Failed to delete project: ${result.error.message}`);
        setSaving(false);
      } else {
        // Redirect to projects page
        router.push("/projects");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("An unexpected error occurred while deleting the project.");
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/projects"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back to Projects
            </Link>
            <h1 className="text-2xl font-bold mt-1">
              {loading ? "Loading Project..." : project?.name}
            </h1>
          </div>
          
          {!loading && project && !isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={toggleVisibility}
                disabled={saving}
                className={`px-3 py-1 border text-white rounded ${
                  project.isPublic 
                    ? 'bg-green-600 hover:bg-green-700 border-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700 border-blue-700'
                }`}
              >
                {saving ? "Saving..." : project.isPublic ? "Public" : "Private"}
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Project saved successfully!
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : !project ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Project not found.
          </div>
        ) : isEditing ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Awesome Project"
                  required
                  disabled={saving}
                />
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
                    disabled={saving}
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-700">
                    Make this project public
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Public projects can be viewed by anyone with your profile link.
                </p>
              </div>
              
              {/* Project Details */}
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project and its goals..."
                  disabled={saving}
                />
              </div>
              
              {/* Time Estimates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    id="estimatedTime"
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 weeks, 20 hours"
                    disabled={saving}
                  />
                </div>
                
                <div>
                  <label htmlFor="availableTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Available Time
                  </label>
                  <input
                    id="availableTime"
                    type="text"
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5 hours/week"
                    disabled={saving}
                  />
                </div>
              </div>
              
              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline
                </label>
                <input
                  id="timeline"
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Complete by June 1st"
                  disabled={saving}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300"
                >
                  Delete Project
                </button>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          // View Project Details
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Project Status */}
              <div className="flex justify-between items-start mb-4">
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {project.isPublic ? 'Public' : 'Private'}
                </span>
                
                {project.createdAt && (
                  <span className="text-sm text-gray-500">
                    Created on {new Date(project.createdAt.toDate()).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {/* Project Details */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-1">Details</h2>
                <p className="text-gray-600">
                  {project.details || "No details provided"}
                </p>
              </div>
              
              {/* Project Metadata */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Estimated Time</h3>
                  <p className="mt-1 text-gray-600">{project.estimatedTime || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Available Time</h3>
                  <p className="mt-1 text-gray-600">{project.availableTime || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Timeline</h3>
                  <p className="mt-1 text-gray-600">{project.timeline || "Not specified"}</p>
                </div>
              </div>
              
              {/* Log Entries Placeholder - will be implemented in Step 8 */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Progress Logs</h2>
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded">
                  <p>You haven&apos;t added any log entries yet.</p>
                  <p className="text-sm mt-1">Log entries will be available in a future update.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 