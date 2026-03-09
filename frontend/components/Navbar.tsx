'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span>ResumeForge<span className="text-indigo-600"> AI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
