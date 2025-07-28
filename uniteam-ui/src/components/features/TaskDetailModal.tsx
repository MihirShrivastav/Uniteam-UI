import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { Button } from '../ui/Button';
import {
  Dismiss24Regular,
  Calendar24Regular,
  Person24Regular,
  Flag24Filled,
  Edit24Regular,
  Delete24Regular,
  Checkmark24Regular,
  Clock24Regular,
  Star24Regular,
  Star24Filled,
  MoreHorizontal24Regular,
  Tag24Regular,
  Comment24Regular,
  History24Regular,
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
  const [activeTab, setActiveTab] = useState<'activity' | 'comments' | 'assigned'>('activity');
  const [isStarred, setIsStarred] = useState(false);

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
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Team spaces › Tasks
              </div>
              <h1 className={`text-xl font-semibold ${
                task.status === 'completed'
                  ? 'line-through text-neutral-500 dark:text-neutral-400'
                  : 'text-neutral-900 dark:text-neutral-100'
              }`}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-transparent border-none outline-none w-full"
                    autoFocus
                  />
                ) : (
                  task.title
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className="p-2 text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            >
              {isStarred ? (
                <Star24Filled className="w-5 h-5 text-yellow-500" />
              ) : (
                <Star24Regular className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Dismiss24Regular className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
              <MoreHorizontal24Regular className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Task Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Created Time */}
                <div className="flex items-center gap-3">
                  <Clock24Regular className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Created time</div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {formatDate(task.createdAt)} {new Date(task.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-yellow-500' :
                      task.status === 'overdue' ? 'bg-red-500' :
                      'bg-neutral-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Status</div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-md inline-block ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      task.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}>
                      {task.status === 'in_progress' ? 'In Progress' :
                       task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-3">
                  <Flag24Filled className={`w-4 h-4 ${
                    task.priority === 'urgent' ? 'text-red-500' :
                    task.priority === 'high' ? 'text-orange-500' :
                    task.priority === 'medium' ? 'text-yellow-500' :
                    'text-neutral-400'
                  }`} />
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Priority</div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 capitalize">
                      {task.priority}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center gap-3">
                    <Calendar24Regular className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Due Date</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex items-start gap-3">
                  <Tag24Regular className="w-4 h-4 text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {project && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                          {project.name}
                        </span>
                      )}
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assignees */}
                {assignee && (
                  <div className="flex items-center gap-3">
                    <Person24Regular className="w-4 h-4 text-neutral-400" />
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Assignees</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {assignee.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {assignee.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Project Description */}
            {task.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Project Description
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isEditing ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      rows={3}
                      placeholder="Add a description..."
                    />
                  ) : (
                    task.description
                  )}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 mb-6">
                <Button onClick={handleSave} className="px-4 py-2 text-sm">
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm">
                  Cancel
                </Button>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
              <nav className="flex space-x-8">
                {['activity', 'comments', 'assigned'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                    }`}
                  >
                    {tab === 'activity' ? 'Activity' :
                     tab === 'comments' ? 'My Work' :
                     'Assigned'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                    Today
                  </div>

                  {/* Activity Items */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {assignee?.name.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {assignee?.name || 'User'}
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {' '}changed the status of "{task.title}" from{' '}
                          </span>
                          <span className="font-medium">To Do</span>
                          <span className="text-neutral-600 dark:text-neutral-400"> to </span>
                          <span className="font-medium">In Progress</span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {new Date().toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        H
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            Hanna Philips
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {' '}added reaction 👍 in{' '}
                          </span>
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          8:20 AM
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        D
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            Davis Donin
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {' '}uploaded file{' '}
                          </span>
                          <span className="font-medium">User flow</span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          9:45 AM
                        </div>
                        <div className="mt-2 p-2 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 max-w-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                User Flow
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                PDF • 2.3 mb
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-6 mb-3">
                    Yesterday
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      T
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          Talan Korsgaard
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {' '}added reaction 👍 in{' '}
                        </span>
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        10:45 AM
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="text-center py-8">
                  <Comment24Regular className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No comments yet. Start a conversation!
                  </p>
                </div>
              )}

              {activeTab === 'assigned' && (
                <div className="text-center py-8">
                  <Person24Regular className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Task assigned to {assignee?.name || 'Unknown'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {!isEditing && (
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Edit24Regular className="w-4 h-4" />
                  Edit Task
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleStatus}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Checkmark24Regular className="w-4 h-4" />
                  {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Delete24Regular className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}