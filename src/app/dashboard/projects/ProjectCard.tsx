'use client';

import type { Project } from '@/types/types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
            project.priority
          )}`}
        >
          {project.priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {project.description || 'No description'}
      </p>
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority}
          </span>
          <span className="text-sm text-gray-500">
            Due {project.end_date ? format(new Date(project.end_date), 'MMM d, yyyy') : 'No due date'}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500 capitalize">
          {project.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
