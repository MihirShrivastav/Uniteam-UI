import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTaskStatus, updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  MoreHorizontal24Regular,
  Checkmark24Regular,
  Delete24Regular,
} from '@fluentui/react-icons';

// Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId: string;
  projectId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface TaskCardProps {
  task: Task;
  viewMode: 'list' | 'card';
  category: string;
}

export function TaskCard({ task, viewMode, category }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.teams?.members || []);
  const projects = useAppSelector(state => state.projects?.projects || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Helper functions
  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'completed';
  };

  const isDueToday = (task: Task): boolean => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    }).format(new Date(date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    handleStatusChange(newStatus);
  };

  const handleSaveEdit = () => {
    dispatch(updateTask({
      id: task.id,
      updates: {
        title: editTitle,
        description: editDescription,
        updatedAt: new Date(),
      }
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const assignee = users.find(user => user.id === task.assigneeId);
  const project = projects.find(proj => proj.id === task.projectId);

  if (viewMode === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="group flex items-center gap-3 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg border-b border-neutral-200 dark:border-neutral-700"
      >
        {/* Status Checkbox */}
        <button
          onClick={handleStatusToggle}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-neutral-300 dark:border-neutral-600 hover:border-green-400'
          }`}
        >
          {task.status === 'completed' && (
            <Checkmark24Regular className="w-2.5 h-2.5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div onClick={() => onTaskClick(task)} className="cursor-pointer">
            <h3 className={`text-sm font-medium truncate ${
              task.status === 'completed'
                ? 'line-through text-neutral-400 dark:text-neutral-500'
                : 'text-neutral-800 dark:text-neutral-200'
            }`}>
              {task.title}
            </h3>
          </div>
        </div>

        {/* Tags and Metadata */}
        <div className="flex items-center gap-2">
          {/* Project Tag */}
          {project && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {project.name}
            </div>
          )}
          
          {/* Recurring Tag */}
          {task.tags.includes('recurring') && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Weekly
            </div>
          )}

          {/* Assignee */}
          {assignee && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {assignee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal24Regular className="w-4 h-4 text-neutral-500" />
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded-lg"
          >
            <Delete24Regular className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Card view
  return (
    <div ref={setNodeRef} style={style}>
      <div className="group relative bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        {/* Priority Indicator */}
        <div className={`h-1 w-full rounded-t-lg ${
          task.priority === 'urgent' 
            ? 'bg-gradient-to-r from-red-400 to-pink-500'
            : task.priority === 'high'
            ? 'bg-gradient-to-r from-orange-400 to-red-400'
            : task.priority === 'medium'
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
            : 'bg-gradient-to-r from-green-400 to-blue-400'
        }`}></div>

        <div className="p-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
          >
            <MoreHorizontal24Regular className="w-4 h-4 text-neutral-500" />
          </div>

          {/* Status Checkbox and Task Content */}
          <div className="flex items-start gap-3 mb-3">
            <button
              onClick={handleStatusToggle}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-neutral-300 dark:border-neutral-600 hover:border-green-400'
              }`}
            >
              {task.status === 'completed' && (
                <Checkmark24Regular className="w-2.5 h-2.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div onClick={() => onTaskClick(task)} className="cursor-pointer">
                <h3 className={`text-sm font-medium ${
                  task.status === 'completed'
                    ? 'line-through text-neutral-400 dark:text-neutral-500'
                    : 'text-neutral-800 dark:text-neutral-200'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Tags and Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Project Tag */}
            {project && (
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                {project.name}
              </div>
            )}
            
            {/* Recurring Tag */}
            {task.tags.includes('recurring') && (
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Weekly
              </div>
            )}
          </div>

          {/* Footer with Assignee and Actions */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700">
            {/* Assignee */}
            {assignee && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {assignee.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded-lg"
            >
              <Delete24Regular className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}