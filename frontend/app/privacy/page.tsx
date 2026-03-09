"use client";

import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      points: [
        "Account information (email address)",
        "Resume content you upload",
        "Job descriptions used for role matching",
        "Feature usage and interaction analytics",
      ],
    },
    {
      title: "2. How We Use Your Information",
      points: [
        "Provide resume analysis and writing suggestions",
        "Generate role-specific cover letters and interview prep",
        "Enforce plan limits and manage billing features",
        "Improve product quality and reliability",
      ],
    },
    {
      title: "3. Data Security",
      text: "We use industry-standard controls to protect your data, including encryption in transit and secure access management.",
    },
    {
      title: "4. AI Processing",
      text: "Your content is processed by third-party AI providers only to deliver requested features and is handled under their enterprise privacy terms.",
    },
    {
      title: "5. Data Retention",
      text: "We retain data while your account is active and delete data upon valid requests, subject to legal obligations.",
    },
    {
      title: "6. Your Rights",
      points: [
        "Access your personal data",
        "Request deletion",
        "Request data export",
        "Contact us for privacy concerns",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-3 text-slate-300">
            We value your trust and handle your personal data with care and transparency.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="mb-3 text-xl font-semibold text-white">{section.title}</h2>
              {section.points ? (
                <ul className="list-disc space-y-1 pl-5 text-slate-300">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-slate-300">{section.text}</p>
              )}
            </section>
          ))}

          <section className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
            <h2 className="mb-2 text-xl font-semibold text-white">7. Contact Us</h2>
            <p className="text-slate-300">For privacy-related requests, contact privacy@resumeforge.ai.</p>
            <p className="mt-4 text-sm text-slate-400">Last updated: March 2026</p>
            <div className="mt-4 flex gap-3">
              <Link href="/terms" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                Read Terms
              </Link>
              <Link href="/about" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                About ResumeForge AI
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
