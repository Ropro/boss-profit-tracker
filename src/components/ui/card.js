import React from 'react';

export function Card({ children }) {
  return <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">{children}</div>;
}
export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}