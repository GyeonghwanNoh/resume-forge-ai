'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resumeService } from '@/lib/auth';
import { FileText, Copy, ArrowRight, Wand2 } from 'lucide-react';
import AppTopbar from '@/components/AppTopbar';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

function CoverLetterPageContent() {
  const searchParams = useSearchParams();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeId, setResumeId] = useState(searchParams.get('resumeId') ?? '');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || !resumeId) return;

    setLoading(true);
    setError('');
    try {
      const response = await resumeService.generateCoverLetter(resumeId, jobDescription);
      setCoverLetter(response.cover_letter);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <PageHeader
          eyebrow="Application writing"
          title="Generate a role-specific cover letter"
          description="Use your resume context plus a target job description to produce a clean first draft in seconds."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Resume ID</label>
              <input
                type="text"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                placeholder="Paste your resume ID here"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                rows={8}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-400"
            >
              {loading ? 'Generating...' : 'Generate My Cover Letter'} {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {!coverLetter && (
            <div className="mt-8">
              <EmptyState
                title="No draft yet"
                description="Add your resume ID and target job description to generate a polished first draft you can customize quickly."
                icon={<Wand2 className="h-5 w-5" />}
              />
            </div>
          )}

          {coverLetter && (
            <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
              <h2 className="mb-4 inline-flex items-center gap-2 text-2xl font-bold text-indigo-800">
                <FileText className="h-5 w-5" /> Your cover letter
              </h2>
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-indigo-200 bg-white p-4 text-slate-700">
                {coverLetter}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(coverLetter)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Copy className="h-4 w-4" /> Copy text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-base font-medium text-slate-700">Loading editor...</p>
          </div>
        </div>
      }
    >
      <CoverLetterPageContent />
    </Suspense>
  );
}
