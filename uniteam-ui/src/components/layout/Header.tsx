import React from 'react';
import { Logo } from '../ui/Logo';
import {
  Navigation24Regular,
  Search24Regular,
  Alert24Regular,
  ChevronDown24Regular,
} from '@fluentui/react-icons';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-x-4 px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-neutral-700 dark:text-neutral-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Navigation24Regular className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 lg:hidden" />

      {/* Logo for mobile */}
      <div className="flex lg:hidden">
        <Logo size="sm" />
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-lg flex items-center">
            <Search24Regular className="pointer-events-none absolute left-3 w-4 h-4 text-neutral-400" />
            <input
              id="search-field"
              className="block w-full h-9 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-2 pl-10 pr-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Search tasks, projects, or team members..."
              type="search"
              name="search"
            />
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-400 hover:text-neutral-600"
          >
            <span className="sr-only">View notifications</span>
            <Alert24Regular className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-200" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
              id="user-menu-button"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-700">
                  JD
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-medium leading-6 text-neutral-900">
                  John Doe
                </span>
                <ChevronDown24Regular className="ml-2 h-5 w-5 text-neutral-400" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}