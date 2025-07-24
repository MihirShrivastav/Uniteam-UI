import React from 'react';
import { useTheme } from './ThemeProvider';
import logoLight from '../../assets/uniteam-logo-light.svg';
import logoDark from '../../assets/uniteam-logo-dark.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const { resolvedTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src={resolvedTheme === 'dark' ? logoDark : logoLight}
        alt="Uniteam" 
        className="h-full w-auto"
      />
    </div>
  );
}