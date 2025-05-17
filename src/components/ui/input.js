import React from 'react';

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-sm ${className}`}
    />
  );
}