/**
 * Local storage utilities for persisting UI preferences and temporary data
 */

const STORAGE_KEYS = {
  THEME: 'uniteam-theme',
  USER_PREFERENCES: 'uniteam-user-preferences',
  TASK_FILTERS: 'uniteam-task-filters',
  MEETING_FILTERS: 'uniteam-meeting-filters',
  SIDEBAR_STATE: 'uniteam-sidebar-state',
  ACTIVE_VIEW: 'uniteam-active-view',
} as const;

export const localStorage = {
  // Generic get/set methods
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  },

  // Specific methods for app data
  getUserPreferences: () => {
    return localStorage.get(STORAGE_KEYS.USER_PREFERENCES, {
      notifications: true,
      emailUpdates: true,
      darkMode: 'system',
      language: 'en',
    });
  },

  setUserPreferences: (preferences: any) => {
    localStorage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  getTaskFilters: () => {
    return localStorage.get(STORAGE_KEYS.TASK_FILTERS, {});
  },

  setTaskFilters: (filters: any) => {
    localStorage.set(STORAGE_KEYS.TASK_FILTERS, filters);
  },

  getMeetingFilters: () => {
    return localStorage.get(STORAGE_KEYS.MEETING_FILTERS, {});
  },

  setMeetingFilters: (filters: any) => {
    localStorage.set(STORAGE_KEYS.MEETING_FILTERS, filters);
  },

  getSidebarState: () => {
    return localStorage.get(STORAGE_KEYS.SIDEBAR_STATE, false);
  },

  setSidebarState: (isOpen: boolean) => {
    localStorage.set(STORAGE_KEYS.SIDEBAR_STATE, isOpen);
  },

  getActiveView: () => {
    return localStorage.get(STORAGE_KEYS.ACTIVE_VIEW, 'dashboard');
  },

  setActiveView: (view: string) => {
    localStorage.set(STORAGE_KEYS.ACTIVE_VIEW, view);
  },
};

export { STORAGE_KEYS };