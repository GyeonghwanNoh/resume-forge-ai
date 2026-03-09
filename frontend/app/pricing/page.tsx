'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/ui/Section';
import PricingCard from '@/components/ui/PricingCard';

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel as soon as billing is enabled, with no long-term commitment.',
  },
  {
    q: 'Do free limits reset monthly?',
    a: 'Yes. Monthly limits reset automatically, so you can keep testing without manual resets.',
  },
  {
    q: 'Is this useful for internship applications?',
    a: 'Absolutely. The workflow is designed to improve clarity and role fit for internships and junior roles.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <Section className="bg-white pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            A plan for every stage of your job search
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Start free to improve your resume quality. Upgrade to Pro when you need high-volume tailoring and prep.
          </p>
        </div>
      </Section>

      <Section className="pt-4" containerClassName="max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          <PricingCard
            name="Free"
            subtitle="Best for trying the workflow"
            price="$0"
            ctaLabel="Start Free"
            ctaHref="/signup"
            features={[
              '3 resume analyses per month',
              '3 job match analyses',
              '2 cover letters',
              '2 interview prep sessions',
              '5 bullet point rewrites',
            ]}
          />
          <PricingCard
            highlighted
            badge="Recommended"
            name="Pro"
            subtitle="For active applicants"
            price="$19"
            ctaLabel="Upgrade to Pro"
            ctaHref="/signup"
            features={[
              'Unlimited resume analyses',
              'Unlimited job matching',
              'Unlimited cover letters and prep',
              'Unlimited bullet rewrites',
              'Advanced ATS optimization',
              'Priority AI processing',
            ]}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Feature comparison</h3>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4"><p className="font-semibold text-slate-900">ATS + score breakdown</p><p className="mt-1 text-slate-600">Free and Pro</p></div>
            <div className="rounded-lg bg-slate-50 p-4"><p className="font-semibold text-slate-900">Job-role tailoring</p><p className="mt-1 text-slate-600">Limited in Free, unlimited in Pro</p></div>
            <div className="rounded-lg bg-slate-50 p-4"><p className="font-semibold text-slate-900">Rewrite + prep volume</p><p className="mt-1 text-slate-600">Best value in Pro</p></div>
          </div>
        </div>
      </Section>

      <Section className="pt-4" containerClassName="max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Footer />
    </main>
  );
}
