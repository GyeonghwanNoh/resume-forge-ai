'use client';

import React from 'react';
import { BarChart3, Target, FileText, Lightbulb, Users, CheckCircle2 } from 'lucide-react';
import Section from '@/components/ui/Section';
import FeatureCard from '@/components/ui/FeatureCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Resume Score Breakdown',
      description: 'See overall, ATS, clarity, impact, and grammar scores in one structured report.',
    },
    {
      icon: Target,
      title: 'Job-Specific Match Score',
      description: 'Paste a job description and instantly see missing technical keywords and weak alignment areas.',
    },
    {
      icon: FileText,
      title: 'Tailored Cover Letters',
      description: 'Generate clear, role-targeted cover letters without starting from a blank page.',
    },
    {
      icon: Lightbulb,
      title: 'Bullet Point Rewriter',
      description: 'Transform weak bullets into stronger statements with measurable technical impact.',
    },
    {
      icon: Users,
      title: 'Interview Prep Pack',
      description: 'Generate likely interview questions based on role context so you can prepare with confidence.',
    },
    {
      icon: CheckCircle2,
      title: 'Action Checklist',
      description: 'Get a practical checklist: add GitHub link, quantify impact, improve verbs, and more.',
    },
  ];

  return (
    <Section id="features" className="bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Core capabilities</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">Everything you need to improve and apply faster</h2>
          <p className="mt-4 text-lg text-slate-600">
            Every feature maps to an application outcome: better ATS visibility, clearer technical communication, and stronger role fit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            return (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            );
          })}
        </div>
      </div>
    </Section>
  );
}
