import React from 'react';
import { useTheme } from './ThemeProvider';
import { WeatherSunny24Regular, WeatherMoon24Regular } from '@fluentui/react-icons';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <WeatherSunny24Regular className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      ) : (
        <WeatherMoon24Regular className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      )}
    </button>
  );
}