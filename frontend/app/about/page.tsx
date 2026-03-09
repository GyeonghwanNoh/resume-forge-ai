"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import {
  Bot,
  CheckCircle2,
  FileUp,
  ScanSearch,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  const steps = [
    {
      icon: FileUp,
      title: "Upload your resume",
      body: "Import PDF, DOCX, or TXT. We extract and structure your content for analysis.",
      tone: "from-blue-500 to-indigo-500",
    },
    {
      icon: ScanSearch,
      title: "Get deep AI analysis",
      body: "We score ATS readiness, clarity, impact, and keyword alignment in minutes.",
      tone: "from-emerald-500 to-teal-500",
    },
    {
      icon: Target,
      title: "Match each role",
      body: "Paste a job description and instantly see match score gaps and missing signals.",
      tone: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: Sparkles,
      title: "Apply with confidence",
      body: "Rewrite bullets, generate tailored cover letters, and prep interview talking points.",
      tone: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <Section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700">
            <Bot className="h-4 w-4" />
            About ResumeForge AI
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Built for ambitious professionals who want better interviews, faster
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            ResumeForge AI helps non-native English speakers turn experience into ATS-friendly,
            impact-driven resumes that recruiters actually respond to.
          </p>
        </div>
      </Section>

      <Section containerClassName="max-w-6xl" className="space-y-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Our mission</h2>
          <p className="mb-4 text-slate-600">
            We understand how hard job searching can feel in a second language. The problem is rarely your skill —
            it is how your value is communicated on paper.
          </p>
          <p className="text-slate-600">
            ResumeForge AI closes that gap with practical, role-specific suggestions so your resume sounds clear,
            credible, and hiring-manager ready.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-slate-900">How it works</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${step.tone}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Step {index + 1}</p>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:grid-cols-3">
          <div className="flex items-center gap-3 text-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> <span className="text-emerald-800">ATS-ready formatting</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-200">
            <TrendingUp className="h-5 w-5 text-emerald-600" /> <span className="text-emerald-800">Stronger impact bullets</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-200">
            <Target className="h-5 w-5 text-emerald-600" /> <span className="text-emerald-800">Better role alignment</span>
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">Ready to improve your resume?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-slate-600">
            Start free and see where your resume is holding you back.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Analyze My Resume
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View Pricing
            </Link>
          </div>
        </section>
      </Section>

      <Footer />
    </main>
  );
}
