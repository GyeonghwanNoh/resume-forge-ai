'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Section from '@/components/ui/Section';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>
      <div className="pointer-events-none absolute -left-16 top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <Section className="relative py-24 lg:py-28" containerClassName="">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Built for global tech job seekers</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Improve ATS performance and get interview-ready faster
              <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                with resume guidance that feels recruiter-grade
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-slate-300 sm:text-xl">
              ResumeForge AI helps you rewrite weak bullets, align to target roles, and communicate technical impact clearly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/upload">
                <Button size="lg" className="w-full sm:w-auto">
                  Analyze My Resume
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/#before-after">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  View Sample Analysis
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              ✓ Free tier available · ✓ Role-specific improvements · ✓ Designed for IT internships and junior roles
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">ATS Score: 85/100</p>
                    <p className="text-sm text-slate-300">Strong keyword coverage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="font-semibold">Impact Score: 72/100</p>
                    <p className="text-sm text-slate-300">Add quantified project outcomes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold">Job Match: 78%</p>
                    <p className="text-sm text-slate-300">Missing: Docker, AWS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
}
