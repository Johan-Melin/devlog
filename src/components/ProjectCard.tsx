"use client";

import Link from "next/link";
import { Project } from "@/lib/projects";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  username?: string;
  showEditButton?: boolean;
}

export default function ProjectCard({ project, username, showEditButton = false }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {project.details || "No description provided"}
            </p>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <span>
                Created {project.createdAt ? formatDate(project.createdAt.toDate()) : 'N/A'}
              </span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                project.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.isPublic ? 'Public' : 'Private'}
              </span>
              {project.status !== 'active' && (
                <>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    project.status === 'archived' 
                      ? 'bg-amber-100 text-amber-800'
                      : project.status === 'completed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </>
              )}
            </div>
          </div>
          {showEditButton && (
            <Link
              href={`/projects/${project.id}`}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
      {username && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <Link 
            href={`/${username}/${project.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View Project
          </Link>
        </div>
      )}
    </div>
  );
} 