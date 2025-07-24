import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { Button } from '../ui/Button';
import {
  Dismiss24Regular,
  Calendar24Regular,
  Person24Regular,
  Flag24Regular,
  Edit24Regular,
  Delete24Regular,
  Checkmark24Regular,
} from '@fluentui/react-icons';

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

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export function TaskDetailModal({ task, onClose, onUpdate }: TaskDetailModalProps) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.teams.members);
  const projects = useAppSelector(state => state.projects.projects);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const assignee = users.find(user => user.id === task.assigneeId);
  const project = projects.find(proj => proj.id === task.projectId);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-400 to-pink-500';
      case 'high': return 'from-orange-400 to-yellow-500';
      case 'medium': return 'from-blue-400 to-indigo-500';
      case 'low': return 'from-neutral-300 to-gray-400';
      default: return 'from-neutral-300 to-gray-400';
    }
  };

  const handleSave = () => {
    const updatedTask = {
      ...task,
      title: editTitle,
      description: editDescription,
      updatedAt: new Date(),
    };
    dispatch(updateTask({ id: task.id, updates: updatedTask }));
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
      onClose();
    }
  };

  const toggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = { ...task, status: newStatus };
    dispatch(updateTask({ id: task.id, updates: { status: newStatus } }));
    onUpdate(updatedTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStatus}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                task.status === 'completed'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'border-neutral-300 dark:border-neutral-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}
            >
              {task.status === 'completed' && (
                <Checkmark24Regular className="w-3 h-3" />
              )}
            </button>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Task Details
            </h2>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-2 py-1 text-sm"
            >
              <Edit24Regular className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Delete24Regular className="w-3.5 h-3.5" />
              Delete
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
            >
              <Dismiss24Regular className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  rows={3}
                  placeholder="Add a description..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="flex-1 text-sm py-2">
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 text-sm py-2">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h1 className={`text-lg font-semibold leading-tight ${
                  task.status === 'completed'
                    ? 'line-through text-neutral-500 dark:text-neutral-400'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}>
                  {task.title}
                </h1>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-3">
                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Calendar24Regular className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Due Date
                      </h4>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Person24Regular className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Assigned to
                      </h4>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                        {assignee.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Priority */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Flag24Regular className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Priority
                    </h4>
                    <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium capitalize">
                      {task.priority}
                    </p>
                  </div>
                </div>

                {/* Project */}
                {project && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Project
                      </h4>
                      <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                        {project.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {(project || task.tags.includes('recurring')) && (
                <div>
                  <h3 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    Tags
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Project Tag */}
                    {project && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {project.name}
                      </div>
                    )}
                    
                    {/* Recurring Tag */}
                    {task.tags.includes('recurring') && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Weekly
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                  <div>
                    <span className="font-medium">Created:</span> {formatDate(task.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDate(task.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}