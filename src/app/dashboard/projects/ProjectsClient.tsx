'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import type { Project, ProjectStatus } from '@/types/types';
import {
  PlusIcon,
  ArchiveBoxIcon,
  InboxIcon,
  QueueListIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import CreateProjectModal from './CreateProjectModal';
import ProjectKanbanView from './ProjectKanbanView';
import ProjectListView from './ProjectListView';

const ACTIVE_STAGES: ProjectStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

interface ProjectsClientProps {
  user: User;
}

type ViewMode = 'kanban' | 'list';

export default function ProjectsClient({ user }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('kanban');
  const [activeView, setActiveView] = useState<'active' | 'backlog' | 'archived'>('active');

  const supabase = createClientComponentClient<Database>();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [supabase, user.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const filteredProjects = projects.filter((project) => {
    if (activeView === 'active') return ACTIVE_STAGES.includes(project.status as ProjectStatus);
    return project.status === activeView;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('active')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'active'
                  ? 'text-coral bg-white shadow-sm'
                  : 'text-gray-500 hover:text-coral-600'
              }`}
            >
              <TableCellsIcon className="w-4 h-4" />
              <span>Active</span>
            </button>
            <button
              onClick={() => setActiveView('backlog')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'backlog'
                  ? 'text-coral bg-white shadow-sm'
                  : 'text-gray-500 hover:text-coral-600'
              }`}
            >
              <InboxIcon className="w-4 h-4" />
              <span>Backlog</span>
            </button>
            <button
              onClick={() => setActiveView('archived')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'archived'
                  ? 'text-coral bg-white shadow-sm'
                  : 'text-gray-500 hover:text-coral-600'
              }`}
            >
              <ArchiveBoxIcon className="w-4 h-4" />
              <span>Archived</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-md shadow-sm p-1">
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded ${
                  view === 'kanban'
                    ? 'bg-coral text-white'
                    : 'text-gray-400 hover:text-coral-600'
                }`}
                title="Kanban view"
              >
                <TableCellsIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${
                  view === 'list'
                    ? 'bg-coral text-white'
                    : 'text-gray-400 hover:text-coral-600'
                }`}
                title="List view"
              >
                <QueueListIcon className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-coral hover:bg-coral/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeView === 'active' && view === 'kanban' ? (
            <ProjectKanbanView 
              projects={filteredProjects} 
              activeStages={ACTIVE_STAGES}
              onProjectUpdate={handleProjectUpdate}
            />
          ) : (
            <ProjectListView projects={filteredProjects} />
          )}
        </div>

        <CreateProjectModal
          open={modalOpen}
          setOpen={setModalOpen}
          user={user}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}
