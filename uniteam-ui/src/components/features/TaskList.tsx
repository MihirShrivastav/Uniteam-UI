import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch } from '../../store';
import { reorderTasks } from '../../store/slices/tasksSlice';
import { TaskCard } from './TaskCard';
import { ClipboardTask24Regular } from '@fluentui/react-icons';

// Task interface defined locally to avoid import issues
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId: string;
  projectId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface TaskListProps {
  tasks: Task[];
  viewMode: 'list' | 'card';
  category: string;
  onTaskClick?: (task: Task) => void;
}

export function TaskList({ tasks, viewMode, category, onTaskClick }: TaskListProps) {
  const dispatch = useAppDispatch();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      // For now, we'll just reorder within the current list
      // In a real app, you might want to handle cross-category moves
      dispatch(reorderTasks({ sourceIndex: oldIndex, destinationIndex: newIndex }));
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-200/50 dark:border-blue-700/50">
          <ClipboardTask24Regular className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
          No tasks found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          {category === 'todo' && 'No active tasks right now.'}
          {category === 'upcoming' && 'No upcoming tasks scheduled.'}
          {category === 'done' && 'No completed tasks yet.'}
          {!['todo', 'upcoming', 'done'].includes(category) && 'No tasks in this category.'}
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
      >
        <div className={
          viewMode === 'list'
            ? 'space-y-2'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3'
        }>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              viewMode={viewMode}
              category={category}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
