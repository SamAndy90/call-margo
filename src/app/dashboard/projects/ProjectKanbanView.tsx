'use client';

import { Project, ProjectStatus } from '@/types/types';
import ProjectCard from './ProjectCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import type { Database } from '@/types/supabase';

interface ProjectKanbanViewProps {
  projects: Project[];
  activeStages: ProjectStatus[];
  onProjectUpdate?: (project: Project) => void;
}

export default function ProjectKanbanView({
  projects,
  activeStages,
  onProjectUpdate,
}: ProjectKanbanViewProps) {
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const getProjectsByStatus = (status: ProjectStatus) =>
    projects.filter((project) => project.status === status);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId as ProjectStatus;
    const project = projects.find((p) => p.id === draggableId);

    if (!project) return;

    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', draggableId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state through parent component
      if (onProjectUpdate) {
        onProjectUpdate({
          ...project,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status. Please try again.');
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {activeStages.map((status) => (
            <div key={status} className="space-y-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {status.replace('_', ' ')}
                <span className="ml-2 text-gray-400">
                  ({getProjectsByStatus(status).length})
                </span>
              </h2>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-4 min-h-[200px] rounded-lg p-4 ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : ''
                    }`}
                  >
                    {getProjectsByStatus(status).map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            <ProjectCard project={project} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
