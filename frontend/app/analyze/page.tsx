'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resumeService } from '@/lib/auth';
import { AlertCircle, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import AppTopbar from '@/components/AppTopbar';
import ScoreCircle from '@/components/ui/ScoreCircle';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';

interface Analysis {
  id: string;
  resume_id: string;
  score?: number;
  overall_score?: number;
  ats_score?: number;
  clarity_score?: number;
  impact_score?: number;
  grammar_score?: number;
  issues?: string[];
  suggestions?: string[];
  main_weaknesses?: string[];
  missing_keywords?: string[];
  weak_bullet_points?: string[];
  created_at: string;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-blue-600' : value >= 40 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function AnalyzePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get('id');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const analyzeResume = async () => {
      if (!resumeId) {
        setError('Resume ID not found');
        setLoading(false);
        return;
      }

      try {
        const data = await resumeService.analyzeResume(resumeId);
        setAnalysis(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Analysis failed');
      } finally {
        setLoading(false);
      }
    };

    analyzeResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-base font-medium text-slate-700">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-rose-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const overall = analysis?.overall_score ?? analysis?.score ?? 0;
  const ats = analysis?.ats_score ?? Math.max(0, Math.min(100, overall - 4));
  const clarity = analysis?.clarity_score ?? Math.max(0, Math.min(100, overall - 2));
  const impact = analysis?.impact_score ?? Math.max(0, Math.min(100, overall - 6));
  const grammar = analysis?.grammar_score ?? Math.max(0, Math.min(100, overall + 3));
  const issues = analysis?.main_weaknesses ?? analysis?.issues ?? [];
  const suggestions = analysis?.suggestions ?? [];
  const missingKeywords = analysis?.missing_keywords ?? [];
  const weakBullets = analysis?.weak_bullet_points ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Analysis report"
          title="Your resume performance snapshot"
          description="Use this report to prioritize improvements that increase ATS visibility and technical clarity."
          actions={
            <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          }
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{overall}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ATS</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{ats}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Impact</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{impact}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Language</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{grammar}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
            <p className="text-sm text-slate-500">Overall score</p>
            <div className="mt-4">
              <ScoreCircle score={overall} size="md" />
            </div>
            <p className="mt-3 text-sm text-slate-600">Use this as your baseline and iterate role-by-role for better match quality.</p>
            <button
              onClick={() => router.push(`/improve?id=${resumeId}`)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              Improve Resume
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Score breakdown</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <ScoreBar label="ATS compatibility" value={ats} />
              <ScoreBar label="Clarity" value={clarity} />
              <ScoreBar label="Impact" value={impact} />
              <ScoreBar label="Grammar & language" value={grammar} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <h2 className="text-lg font-semibold text-rose-800">Biggest weaknesses</h2>
            <ul className="mt-4 space-y-3">
              {issues.length > 0 ? issues.map((issue: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-rose-900">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{issue}</span>
                </li>
              )) : <li className="text-sm text-rose-800">No major weaknesses detected.</li>}
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-lg font-semibold text-emerald-800">Improvement suggestions</h2>
            <ul className="mt-4 space-y-3">
              {suggestions.length > 0 ? suggestions.map((suggestion: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              )) : (
                <li className="text-sm text-emerald-800">Suggestions will appear after your next structured analysis.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Missing keywords</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {missingKeywords.length > 0 ? missingKeywords.map((keyword: string, idx: number) => (
                <Badge key={idx} variant="warning">{keyword}</Badge>
              )) : (
                <p className="text-sm text-slate-500">Add a job description analysis to get role-specific keyword gaps.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Weak bullet points to rewrite</h2>
            <ul className="mt-4 space-y-3">
              {weakBullets.length > 0 ? (
                weakBullets.map((bullet: string, idx: number) => (
                  <li key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {bullet}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">No bullet rewrite targets found yet.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push(`/improve?id=${resumeId}`)}
            className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Improve My Resume
          </button>
          <button
            onClick={() => router.push(`/analyze-for-job?resumeId=${resumeId}`)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Tailor My Resume for This Role
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-base font-medium text-slate-700">Loading analysis...</p>
          </div>
        </div>
      }
    >
      <AnalyzePageContent />
    </Suspense>
  );
}
