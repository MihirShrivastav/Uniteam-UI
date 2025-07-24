import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authSlice from './slices/authSlice';
import tasksSlice from './slices/tasksSlice';
import meetingsSlice from './slices/meetingsSlice';
import projectsSlice from './slices/projectsSlice';
import teamsSlice from './slices/teamsSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
    meetings: meetingsSlice,
    projects: projectsSlice,
    teams: teamsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: [
          'auth.user.lastSeen',
          'teams.members.lastSeen',
          'tasks.tasks.createdAt',
          'tasks.tasks.updatedAt',
          'tasks.tasks.dueDate',
          'projects.projects.createdAt',
          'projects.projects.updatedAt',
          'meetings.meetings.startTime',
          'meetings.meetings.endTime',
          'meetings.meetings.createdAt',
        ],
        isSerializable: (value: any) => {
          // Allow Date objects
          if (value instanceof Date) {
            return true;
          }
          return true;
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;