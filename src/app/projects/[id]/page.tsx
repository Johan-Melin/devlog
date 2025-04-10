"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProject } from "@/lib/firebase/firestore";
import { Project } from "@/types/project";
import SignOutButton from '@/components/SignOutButton';
import Link from "next/link";

export default function ProjectDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Load project data
  useEffect(() => {
    async function loadProject() {
      if (!projectId || !user) return;
      
      setLoading(true);
      try {
        const projectData = await getProject(user.uid, projectId);
        if (!projectData) {
          setError("Project not found");
        } else {
          setProject(projectData);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProject();
    }
  }, [projectId, user]);

  if (authLoading || loading) {
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

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
        <Link 
          href="/projects"
          className="text-blue-600 hover:underline"
        >
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href="/projects"
            className="text-blue-600 hover:underline inline-block mb-2"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Project Details</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {project.description || "No description provided."}
        </p>
        <p className="text-sm text-gray-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Project Logs</h2>
        <p className="text-gray-600 text-center">
          Development logs feature coming soon.
        </p>
      </div>
    </div>
  );
}