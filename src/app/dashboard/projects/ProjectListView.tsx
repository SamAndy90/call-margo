'use client';

import { Project } from '@/types/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
} from '@heroicons/react/20/solid';

interface ProjectListViewProps {
  projects: Project[];
}

export default function ProjectListView({ projects }: ProjectListViewProps) {
  const router = useRouter();

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'in_review':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'backlog':
        return 'bg-gray-100 text-gray-600';
      case 'archived':
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="truncate text-sm font-medium text-coral">
                    {project.name}
                  </p>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(
                      project.priority
                    )}`}
                  >
                    {project.priority}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <CalendarIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <p>
                    Due{' '}
                    {project.end_date
                      ? format(new Date(project.end_date), 'MMM d, yyyy')
                      : 'No due date'}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
