import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore } from '../stores/themeStore';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { toggleTheme, isDark } = useThemeStore();

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center rounded-full 
        bg-gray-200 dark:bg-gray-700
        border-2 border-gray-300 dark:border-gray-600
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${className}
      `}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Background */}
      <div
        className={`
          absolute inset-0 rounded-full transition-colors duration-300
          ${isDark
            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
            : 'bg-gradient-to-r from-yellow-400 to-orange-400'
          }
        `}
      />

      {/* Toggle Circle */}
      <div
        className={`
          ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
          bg-white dark:bg-gray-100
          rounded-full shadow-lg
          transform transition-all duration-300 ease-in-out
          flex items-center justify-center
          relative z-10
          ${isDark
            ? (size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-6')
            : 'translate-x-0.5'
          }
        `}
        style={{
          // Removing manual transform style as we are using Tailwind classes
        }}
      >
        {/* Icon */}
        {isDark ? (
          <MoonIcon
            className={`${iconSizeClasses[size]} text-blue-600 transition-all duration-300`}
          />
        ) : (
          <SunIcon
            className={`${iconSizeClasses[size]} text-yellow-600 transition-all duration-300`}
          />
        )}
      </div>

      {/* Animated Stars (Dark Mode) */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
          <div className="absolute bottom-1 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '2s' }} />
        </div>
      )}

      {/* Animated Rays (Light Mode) */}
      {!isDark && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-8 h-8 border border-yellow-300 rounded-full animate-spin"
            style={{ animationDuration: '8s', opacity: 0.3 }} />
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
