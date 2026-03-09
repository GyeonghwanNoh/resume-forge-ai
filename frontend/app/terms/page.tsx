"use client";

import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using ResumeForge AI, you agree to these Terms and all applicable laws and regulations.",
    },
    {
      title: "2. Use License",
      content:
        "You may use ResumeForge AI to upload and analyze your own resumes, generate writing suggestions, and prepare job application materials.",
    },
    {
      title: "3. Usage Limits",
      content:
        "Free plans are subject to monthly limits. Paid plans receive expanded or unlimited usage based on selected tier.",
    },
    {
      title: "4. Privacy and Data",
      content:
        "Your resume data is processed to provide analysis and improvements. Please review our Privacy Policy for full handling details.",
    },
    {
      title: "5. Modifications",
      content:
        "We may update these Terms from time to time. Continued use of the service means you accept the latest version.",
    },
    {
      title: "6. Contact",
      content: "Questions about these Terms can be sent to support@resumeforge.ai.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-3 text-slate-300">
            These terms govern your use of ResumeForge AI. Please read them carefully.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="mb-2 text-xl font-semibold text-white">{section.title}</h2>
              <p className="text-slate-300 leading-relaxed">{section.content}</p>
            </section>
          ))}

          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-400">Last updated: March 2026</p>
            <div className="mt-4 flex gap-3">
              <Link href="/privacy" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                Read Privacy Policy
              </Link>
              <Link href="/pricing" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
