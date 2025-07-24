import React, { useState, useEffect } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Slide-out panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-subtle transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-subtle">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
            <span className="text-heading-3 text-neutral-900 dark:text-neutral-50">
              Uniteam
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
          >
            <XIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Navigation content would go here */}
        <div className="flex-1 px-4 py-6">
          <p className="text-body-sm text-muted">
            Mobile navigation content
          </p>
        </div>
      </div>
    </div>
  );
}

export function MobileNavToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
    >
      <MenuIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
    </button>
  );
}