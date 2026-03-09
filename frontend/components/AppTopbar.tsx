'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface AppTopbarProps {
  action?: React.ReactNode;
}

export default function AppTopbar({ action }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base font-bold">ResumeForge <span className="text-indigo-600">AI</span></span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <Link href="/upload" className="transition hover:text-slate-900">Upload</Link>
            <Link href="/analyze-for-job" className="transition hover:text-slate-900">Job Match</Link>
            <Link href="/bullet-rewriter" className="transition hover:text-slate-900">Rewriter</Link>
            <Link href="/pricing" className="transition hover:text-slate-900">Pricing</Link>
          </nav>
        </div>
        {action}
      </div>
    </header>
  );
}
