'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 px-6 py-14 shadow-2xl sm:px-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>
          <div className="pointer-events-none absolute -left-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 top-10 h-48 w-48 rounded-full bg-cyan-200/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Ready to submit stronger applications this week?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
              Analyze your resume, tailor to your target role, and apply with clearer technical impact.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 sm:w-auto">
                  Analyze My Resume
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-200">
              ✓ 3 free analyses/month · ✓ Use your own job descriptions · ✓ Built for non-native English speakers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
