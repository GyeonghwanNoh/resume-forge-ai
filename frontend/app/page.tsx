'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import BeforeAfterSection from '@/components/sections/BeforeAfterSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/Footer';
import Section from '@/components/ui/Section';

const faqItems = [
  {
    q: 'Who is ResumeForge AI for?',
    a: 'It is designed for international students, non-native English speakers, and early-career developers who need stronger resume positioning.',
  },
  {
    q: 'Does it support IT internships and junior roles?',
    a: 'Yes. The scoring and suggestions are built to highlight project impact and technical relevance for internships and entry-level hiring.',
  },
  {
    q: 'Can I use my own job description?',
    a: 'Absolutely. Paste any role description to get match score, keyword gaps, and practical improvement recommendations.',
  },
  {
    q: 'Is this useful for non-native English speakers?',
    a: 'Yes. ResumeForge AI focuses on clear, professional language that keeps your technical depth while improving readability.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <HeroSection />

      <section className="border-y border-slate-200 bg-slate-50 py-10" id="trust">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">Trusted positioning</p>
          <p className="mx-auto max-w-3xl text-lg text-slate-700">
            Built for international students, non-native English speakers, and early-career IT applicants.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {['ATS-focused scoring', 'Job-match analysis', 'Role-specific rewriting', 'Interview prep support'].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-600 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <PricingSection />

      <Section className="bg-white pt-16" containerClassName="max-w-4xl" id="faq">
        <div className="mx-auto">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">FAQ</p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900">Frequently asked questions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Clear answers before you start optimizing your resume for your next role.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-slate-500">
            Need more detail? <Link href="/about" className="font-semibold text-blue-600 hover:text-blue-700">See how it works.</Link>
          </div>
        </div>
      </Section>

      <CTASection />
      <Footer />
    </main>
  );
}
