import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'gray' | 'danger';
}

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    gray: 'bg-slate-100 text-slate-800',
    danger: 'bg-rose-100 text-rose-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}
