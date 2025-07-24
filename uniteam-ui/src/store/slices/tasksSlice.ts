import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/task';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Update user dashboard design',
    description: 'Redesign the main dashboard with new metrics and improved UX',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2025-01-30'),
    assigneeId: '1',
    projectId: 'proj-1',
    tags: ['design', 'ui/ux'],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-22'),
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Review API documentation',
    description: 'Review and update the API documentation for v2.0',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2025-01-28'),
    assigneeId: '2',
    projectId: 'proj-1',
    tags: ['documentation', 'api', 'recurring'],
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-19'),
    createdBy: '1',
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2025-01-25'),
    assigneeId: '3',
    projectId: 'proj-2',
    tags: ['devops', 'automation'],
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-24'),
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Add comprehensive unit tests for the authentication module',
    status: 'in_progress',
    priority: 'low',
    dueDate: new Date('2025-02-05'),
    assigneeId: '1',
    projectId: 'proj-2',
    tags: ['testing', 'quality'],
    createdAt: new Date('2025-01-21'),
    updatedAt: new Date('2025-01-23'),
    createdBy: '2',
  },
  {
    id: '5',
    title: 'Database migration',
    description: 'Migrate user data to new database schema',
    status: 'overdue',
    priority: 'urgent',
    dueDate: new Date('2025-01-20'),
    assigneeId: '3',
    projectId: 'proj-1',
    tags: ['database', 'migration'],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
    createdBy: '1',
  },
];

const initialState: TasksState = {
  tasks: mockTasks,
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.tasks.unshift(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.status = status;
        task.updatedAt = new Date();
      }
    },
    reorderTasks: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.tasks.splice(sourceIndex, 1);
      state.tasks.splice(destinationIndex, 0, removed);
    },
  },
});

export const {
  setLoading,
  setError,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  reorderTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;