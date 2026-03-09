'use client';

import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import Section from '@/components/ui/Section';

export default function ProblemSolutionSection() {
  return (
    <Section className="bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            The gap is not your skills. It is how they are communicated.
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            ResumeForge AI turns vague resume content into outcome-focused proof recruiters can evaluate quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">What slows candidates down</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✗</span>
                <span className="text-slate-700">ATS filters reject resumes before recruiters read them</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✗</span>
                <span className="text-slate-700">Weak bullets hide technical impact and ownership</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✗</span>
                <span className="text-slate-700">Job-specific keywords are missing or too generic</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✗</span>
                <span className="text-slate-700">Language friction makes achievements sound less credible</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">How ResumeForge AI solves it</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-slate-700">ATS scoring with practical keyword recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-slate-700">Bullet rewrites that emphasize ownership and outcomes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-slate-700">Role-match analysis against your target job description</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-slate-700">Clear professional English for technical achievements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
