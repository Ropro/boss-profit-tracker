import React from 'react';

export function Button({ children, variant = "default", ...props }) {
  const styles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
  };
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl font-semibold text-sm ${styles[variant]} ${props.className || ''}`}
    >
      {children}
    </button>
  );
}