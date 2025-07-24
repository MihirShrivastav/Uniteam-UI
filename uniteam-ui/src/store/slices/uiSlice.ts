import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState, TaskFilters, MeetingFilters, Notification } from '../../types/index';

const initialState: UIState = {
  sidebarOpen: false,
  loading: false,
  notifications: [],
  activeView: 'dashboard',
  taskFilters: {},
  meetingFilters: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setActiveView: (state, action: PayloadAction<UIState['activeView']>) => {
      state.activeView = action.payload;
    },
    setTaskFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.taskFilters = action.payload;
    },
    updateTaskFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },
    clearTaskFilters: (state) => {
      state.taskFilters = {};
    },
    setMeetingFilters: (state, action: PayloadAction<MeetingFilters>) => {
      state.meetingFilters = action.payload;
    },
    updateMeetingFilters: (state, action: PayloadAction<Partial<MeetingFilters>>) => {
      state.meetingFilters = { ...state.meetingFilters, ...action.payload };
    },
    clearMeetingFilters: (state) => {
      state.meetingFilters = {};
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setLoading,
  setActiveView,
  setTaskFilters,
  updateTaskFilters,
  clearTaskFilters,
  setMeetingFilters,
  updateMeetingFilters,
  clearMeetingFilters,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;