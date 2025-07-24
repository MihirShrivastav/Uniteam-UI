import React from 'react';

interface Breadcrumb {
  name: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions, 
  children 
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.name} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-4 h-4 text-neutral-400 mx-2" />
                )}
                {breadcrumb.href ? (
                  <a
                    href={breadcrumb.href}
                    className="text-body-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
                  >
                    {breadcrumb.name}
                  </a>
                ) : (
                  <span className="text-body-sm text-neutral-900 dark:text-neutral-100 font-medium">
                    {breadcrumb.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-heading-1 text-neutral-900 dark:text-neutral-50 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-body-lg text-muted max-w-2xl">
              {description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          </div>
        )}
      </div>

      {/* Additional Content */}
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}