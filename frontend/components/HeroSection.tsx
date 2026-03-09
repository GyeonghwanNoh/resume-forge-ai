'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold mb-6">Turn Your Resume Into an Interview Magnet</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          AI-powered resume analysis, optimization, and interview preparation for non-native English speakers
          and early-career developers.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded hover:bg-gray-100">
            Try Free Demo
          </button>
          <button className="px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-blue-600">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
