'use client';

import React, { useState } from 'react';
import { resumeService } from '@/lib/auth';
import { MessageSquare, ArrowRight, Brain } from 'lucide-react';
import AppTopbar from '@/components/AppTopbar';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription) return;

    setLoading(true);
    setError('');
    try {
      const response = await resumeService.generateInterviewQuestions(jobDescription);
      setQuestions(response.questions);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <PageHeader
          eyebrow="Interview prep"
          title="Generate role-specific interview questions"
          description="Use your target job description to prepare sharper, more relevant technical interview answers."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

          <form onSubmit={handleGenerate} className="space-y-6 mb-8">
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
              {loading ? 'Generating...' : 'Generate Interview Questions'} {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {questions.length === 0 && (
            <EmptyState
              title="No interview questions yet"
              description="Paste a role description to generate technical and behavioral questions tailored to your target position."
              icon={<Brain className="h-5 w-5" />}
            />
          )}

          {questions.length > 0 && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
              <h2 className="text-2xl font-bold mb-6 text-indigo-800 inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Interview questions
              </h2>
              <div className="space-y-4">
                {questions.map((question, idx) => (
                  <div key={idx} className="rounded-lg border border-indigo-200 bg-white p-4">
                    <p className="font-semibold text-indigo-700 mb-2">Question {idx + 1}</p>
                    <p className="text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
