'use client';

import React from 'react';
import Section from '@/components/ui/Section';
import PricingCard from '@/components/ui/PricingCard';

export default function PricingSection() {
  return (
    <Section id="pricing" className="bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Pricing preview</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">Start free. Upgrade when you are applying seriously.</h2>
          <p className="mt-4 text-lg text-slate-600">Transparent plans for early testing and high-volume job application cycles.</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <PricingCard
            name="Free"
            subtitle="Great for testing the workflow"
            price="$0"
            ctaLabel="Get Started Free"
            ctaHref="/signup"
            features={[
              '3 resume analyses/month',
              '2 cover letters/month',
              '2 interview prep sessions/month',
              'Limited bullet rewrites',
            ]}
          />
          <PricingCard
            highlighted
            badge="Most Popular"
            name="Pro"
            subtitle="For active applicants"
            price="$19"
            ctaLabel="View Full Pro Details"
            ctaHref="/pricing"
            features={[
              'Unlimited resume analyses',
              'Unlimited cover letters',
              'Advanced ATS and keyword analysis',
              'Unlimited job-match and bullet rewrites',
            ]}
          />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">Monthly usage limits reset automatically. Cancel anytime when billing is enabled.</p>
      </div>
    </Section>
  );
}
