'use client';

import React from 'react';
import { Upload, Target, Edit } from 'lucide-react';
import Section from '@/components/ui/Section';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      number: '01',
      title: 'Upload Resume',
      description: 'Upload your PDF, DOCX, or TXT and start from your current resume.',
    },
    {
      icon: Target,
      number: '02',
      title: 'Analyze for Target Role',
      description: 'Paste a job description to see match score, missing keywords, and gaps.',
    },
    {
      icon: Edit,
      number: '03',
      title: 'Improve and Apply Faster',
      description: 'Rewrite bullets, generate role-ready documents, and prepare confidently.',
    },
  ];

  return (
    <Section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How it works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A practical workflow designed for real application speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-1/2 h-0.5 w-full bg-gradient-to-r from-indigo-200 to-indigo-300 z-0" />
                )}
                <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative z-10">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-0 right-0 text-6xl font-bold text-slate-100">
                      {step.number}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
