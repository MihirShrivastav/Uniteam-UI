/**
 * Mock API services to simulate backend responses
 * This provides realistic data and timing for UI development
 */

import type { Task, Meeting, Project, Team, User, Notification } from '../types';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);
      if (email === 'demo@uniteam.ai' && password === 'demo') {
        return {
          success: true,
          user: {
            id: '1',
            name: 'John Doe',
            email: 'demo@uniteam.ai',
            role: 'team_leader' as const,
            status: 'online' as const,
            lastSeen: new Date(),
          },
          token: 'mock-jwt-token',
        };
      }
      throw new Error('Invalid credentials');
    },

    logout: async () => {
      await delay(300);
      return { success: true };
    },

    refreshToken: async () => {
      await delay(200);
      return { token: 'new-mock-jwt-token' };
    },
  },

  // Tasks
  tasks: {
    getAll: async (): Promise<Task[]> => {
      await delay();
      // Return tasks from store or mock data
      return [];
    },

    create: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      await delay(600);
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newTask;
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      await delay(400);
      // Simulate updated task
      return {
        id,
        ...updates,
        updatedAt: new Date(),
      } as Task;
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);
      // Simulate deletion
    },
  },

  // Meetings
  meetings: {
    getAll: async (): Promise<Meeting[]> => {
      await delay();
      return [];
    },

    create: async (meetingData: Omit<Meeting, 'id'>): Promise<Meeting> => {
      await delay(700);
      const newMeeting: Meeting = {
        ...meetingData,
        id: Date.now().toString(),
      };
      return newMeeting;
    },

    update: async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
      await delay(400);
      return {
        id,
        ...updates,
      } as Meeting;
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);
    },
  },

  // Projects
  projects: {
    getAll: async (): Promise<Project[]> => {
      await delay();
      return [];
    },

    create: async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
      await delay(800);
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        createdAt: new Date(),
      };
      return newProject;
    },

    update: async (id: string, updates: Partial<Project>): Promise<Project> => {
      await delay(500);
      return {
        id,
        ...updates,
      } as Project;
    },

    delete: async (id: string): Promise<void> => {
      await delay(400);
    },
  },

  // Teams
  teams: {
    getAll: async (): Promise<Team[]> => {
      await delay();
      return [];
    },

    getMembers: async (): Promise<User[]> => {
      await delay();
      return [];
    },

    create: async (teamData: Omit<Team, 'id' | 'createdAt'>): Promise<Team> => {
      await delay(600);
      const newTeam: Team = {
        ...teamData,
        id: `team-${Date.now()}`,
        createdAt: new Date(),
      };
      return newTeam;
    },

    update: async (id: string, updates: Partial<Team>): Promise<Team> => {
      await delay(400);
      return {
        id,
        ...updates,
      } as Team;
    },

    addMember: async (teamId: string, memberId: string): Promise<void> => {
      await delay(300);
    },

    removeMember: async (teamId: string, memberId: string): Promise<void> => {
      await delay(300);
    },
  },

  // Notifications
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await delay(200);
      return [
        {
          id: '1',
          title: 'New task assigned',
          message: 'You have been assigned to "Update user dashboard design"',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          actionUrl: '/tasks/1',
        },
        {
          id: '2',
          title: 'Meeting reminder',
          message: 'Sprint Planning meeting starts in 15 minutes',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          actionUrl: '/meetings/1',
        },
        {
          id: '3',
          title: 'Task completed',
          message: 'Mike Johnson completed "Setup CI/CD pipeline"',
          type: 'success',
          read: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          actionUrl: '/tasks/3',
        },
      ];
    },

    markAsRead: async (id: string): Promise<void> => {
      await delay(200);
    },

    delete: async (id: string): Promise<void> => {
      await delay(200);
    },
  },

  // Analytics
  analytics: {
    getDashboardStats: async () => {
      await delay(400);
      return {
        activeTasks: 24,
        completedTasks: 156,
        teamMembers: 12,
        activeProjects: 8,
        taskCompletionRate: 87,
        averageTaskTime: 3.2,
        upcomingDeadlines: 5,
        overdueItems: 2,
      };
    },

    getTaskAnalytics: async () => {
      await delay(500);
      return {
        completionTrend: [65, 72, 68, 81, 87, 92, 89],
        priorityDistribution: {
          low: 15,
          medium: 45,
          high: 30,
          urgent: 10,
        },
        statusDistribution: {
          pending: 20,
          in_progress: 35,
          completed: 40,
          overdue: 5,
        },
      };
    },

    getTeamPerformance: async () => {
      await delay(600);
      return {
        productivity: 85,
        collaboration: 92,
        taskVelocity: 78,
        memberPerformance: [
          { id: '1', name: 'John Doe', completedTasks: 23, efficiency: 89 },
          { id: '2', name: 'Sarah Chen', completedTasks: 19, efficiency: 94 },
          { id: '3', name: 'Mike Johnson', completedTasks: 17, efficiency: 82 },
          { id: '4', name: 'Emily Davis', completedTasks: 21, efficiency: 87 },
        ],
      };
    },
  },
};

// Error simulation for testing error states
export const simulateError = (message: string = 'Something went wrong') => {
  throw new Error(message);
};

// Network status simulation
export const simulateOffline = () => {
  return Promise.reject(new Error('Network unavailable'));
};