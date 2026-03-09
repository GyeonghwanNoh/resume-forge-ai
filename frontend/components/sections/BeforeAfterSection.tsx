'use client';

import React from 'react';
import Section from '@/components/ui/Section';

export default function BeforeAfterSection() {
  return (
    <Section id="before-after" className="bg-slate-50" containerClassName="max-w-5xl">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Before and after: stronger bullets in seconds
          </h2>
          <p className="text-xl text-slate-600">
            Show measurable impact, modern stack relevance, and clear ownership.
          </p>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="border-r border-slate-200 bg-rose-50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">❌</span>
                  <h3 className="text-lg font-bold text-slate-900">Weak bullet</h3>
                </div>
                <p className="italic text-slate-700">
                  "Worked on backend development for the company website."
                </p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>⚠ Vague action verb</p>
                  <p>⚠ No measurable impact</p>
                  <p>⚠ Missing technologies</p>
                </div>
              </div>
              <div className="bg-emerald-50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-lg font-bold text-slate-900">Improved bullet</h3>
                </div>
                <p className="font-medium text-slate-900">
                  "Architected and deployed REST APIs using Python/FastAPI, serving 10K+ daily requests with 99.5% uptime."
                </p>
                <div className="mt-4 space-y-2 text-sm text-emerald-700">
                  <p>✓ Strong action verb</p>
                  <p>✓ Quantified results</p>
                  <p>✓ Specific tech stack</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="border-r border-slate-200 bg-rose-50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">❌</span>
                  <h3 className="text-lg font-bold text-slate-900">Weak bullet</h3>
                </div>
                <p className="italic text-slate-700">
                  "Helped team with React project."
                </p>
              </div>
              <div className="bg-emerald-50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-lg font-bold text-slate-900">Improved bullet</h3>
                </div>
                <p className="font-medium text-slate-900">
                  "Led development of React dashboard; improved page load time by 60% and user engagement by 35%."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
