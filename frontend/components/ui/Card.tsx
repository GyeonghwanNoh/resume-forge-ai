import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md' : ''} ${className}`}>
      {children}
    </div>
  );
}
