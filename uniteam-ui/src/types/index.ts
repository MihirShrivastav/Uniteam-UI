// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'member' | 'team_leader' | 'admin';
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

// Re-export Task types from separate file
export type { Task, TaskFilters } from './task';

// Meeting types
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendeeIds: string[];
  location?: string;
  meetingLink?: string;
  agenda: string[];
  projectId?: string;
  createdBy: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  progress: number;
  startDate: Date;
  deadline?: Date;
  createdAt: Date;
  createdBy: string;
}

// Team types
export interface Team {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  leaderId: string;
  createdAt: Date;
}

// Milestone types
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  taskIds: string[];
}

// Issue types
export interface Issue {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string;
  reporterId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  metadata?: {
    action?: string;
    data?: any;
  };
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// TaskFilters is now exported from ./task

export interface MeetingFilters {
  status?: Meeting['status'][];
  attendee?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  activeView: 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'projects' | 'team' | 'analytics';
  taskFilters: TaskFilters;
  meetingFilters: MeetingFilters;
}