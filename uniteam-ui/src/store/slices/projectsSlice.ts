import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '../../types/index';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX',
    teamId: 'team-1',
    status: 'active',
    progress: 65,
    startDate: new Date('2025-01-01'),
    deadline: new Date('2025-03-01'),
    createdAt: new Date('2024-12-15'),
    createdBy: '1',
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Develop native mobile app for iOS and Android',
    teamId: 'team-1',
    status: 'active',
    progress: 30,
    startDate: new Date('2025-01-15'),
    deadline: new Date('2025-06-01'),
    createdAt: new Date('2025-01-10'),
    createdBy: '1',
  },
  {
    id: 'proj-3',
    name: 'API Documentation',
    description: 'Create comprehensive API documentation',
    teamId: 'team-2',
    status: 'planning',
    progress: 10,
    startDate: new Date('2025-02-01'),
    deadline: new Date('2025-04-01'),
    createdAt: new Date('2025-01-20'),
    createdBy: '2',
  },
  {
    id: 'proj-4',
    name: 'Security Audit',
    description: 'Complete security audit and vulnerability assessment',
    teamId: 'team-2',
    status: 'completed',
    progress: 100,
    startDate: new Date('2024-11-01'),
    deadline: new Date('2024-12-31'),
    createdAt: new Date('2024-10-15'),
    createdBy: '1',
  },
];

const initialState: ProjectsState = {
  projects: mockProjects,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt'>>) => {
      const newProject: Project = {
        ...action.payload,
        id: `proj-${Date.now()}`,
        createdAt: new Date(),
      };
      state.projects.push(newProject);
    },
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          ...updates,
        };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    updateProjectProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const { id, progress } = action.payload;
      const project = state.projects.find(project => project.id === id);
      if (project) {
        project.progress = Math.max(0, Math.min(100, progress));
      }
    },
    updateProjectStatus: (state, action: PayloadAction<{ id: string; status: Project['status'] }>) => {
      const { id, status } = action.payload;
      const project = state.projects.find(project => project.id === id);
      if (project) {
        project.status = status;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
  updateProjectStatus,
} = projectsSlice.actions;

export default projectsSlice.reducer;