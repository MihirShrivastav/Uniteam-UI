import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type CurrentPage = 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'projects' | 'team' | 'analytics';

interface AppShellProps {
  children: React.ReactNode;
  onNavigate?: (page: CurrentPage) => void;
  currentPage?: CurrentPage;
}

export function AppShell({ children, onNavigate, currentPage = 'dashboard' }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area - rounded white rectangle */}
      <div className="lg:pl-64 p-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm min-h-[calc(100vh-3rem)] border-l border-neutral-200 dark:border-transparent">
          {/* Header integrated into main area */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Thin separator line */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 mx-6"></div>
          
          {/* Page content */}
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Left sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
    </div>
  );
}