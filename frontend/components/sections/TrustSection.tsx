'use client';

import React from 'react';
import { Users, Award, TrendingUp, Globe } from 'lucide-react';

export default function TrustSection() {
  const stats = [
    { icon: Users, label: 'IT Job Seekers', value: '1,000+' },
    { icon: Award, label: 'Success Rate', value: '87%' },
    { icon: TrendingUp, label: 'Improvements', value: '5,000+' },
    { icon: Globe, label: 'Countries', value: '45+' },
  ];

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            Trusted by International IT Professionals
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Helping Non-Native Speakers Land Better Jobs
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
