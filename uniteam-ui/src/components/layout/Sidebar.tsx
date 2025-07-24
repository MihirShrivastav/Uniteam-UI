import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import {
  Home24Regular,
  TaskListSquareLtr24Regular,
  Calendar24Regular,
  VideoChat24Regular,
  FolderOpen24Regular,
  People24Regular,
  DataBarVertical24Regular,
} from '@fluentui/react-icons';

type CurrentPage = 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'projects' | 'team' | 'analytics';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: CurrentPage) => void;
  currentPage?: CurrentPage;
}

interface NavigationItem {
  name: string;
  page: CurrentPage;
  icon: React.ReactNode;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    page: 'dashboard',
    icon: <Home24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Tasks',
    page: 'tasks',
    icon: <TaskListSquareLtr24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Calendar',
    page: 'calendar',
    icon: <Calendar24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Meetings',
    page: 'meetings',
    icon: <VideoChat24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Projects',
    page: 'projects',
    icon: <FolderOpen24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Team',
    page: 'team',
    icon: <People24Regular className="w-5 h-5 flex-shrink-0" />,
  },
  {
    name: 'Analytics',
    page: 'analytics',
    icon: <DataBarVertical24Regular className="w-5 h-5 flex-shrink-0" />,
  },
];

export function Sidebar({ isOpen, onClose, onNavigate, currentPage = 'dashboard' }: SidebarProps) {
  const handleNavClick = (page: CurrentPage) => {
    if (onNavigate) {
      onNavigate(page);
    }
    onClose(); // Close mobile sidebar after navigation
  };
  return (
    <>
      {/* Desktop sidebar - positioned on the left */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 px-6 py-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavClick(item.page)}
                        className={`group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors duration-200 w-full text-left ${
                          currentPage === item.page
                            ? 'bg-white dark:bg-neutral-800 text-primary-700 dark:text-primary-400 shadow-sm'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 hover:shadow-sm'
                        }`}
                      >
                        <span className={`${currentPage === item.page ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Bottom section */}
              <li className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-700">
                        JD
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">John Doe</p>
                      <p className="text-neutral-500 dark:text-neutral-400">john@example.com</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${isOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={onClose}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 px-6 py-4">
              {/* Logo */}
              <div className="flex h-16 shrink-0 items-center">
                <Logo size="md" />
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <button
                            onClick={() => handleNavClick(item.page)}
                            className={`group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors duration-200 w-full text-left ${
                              currentPage === item.page
                                ? 'bg-white dark:bg-neutral-800 text-primary-700 dark:text-primary-400 shadow-sm'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 hover:shadow-sm'
                            }`}
                          >
                            <span className={`${currentPage === item.page ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'}`}>
                              {item.icon}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Bottom section */}
                  <li className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            JD
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">John Doe</p>
                          <p className="text-neutral-500 dark:text-neutral-400">john@example.com</p>
                        </div>
                      </div>
                      <ThemeToggle />
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}