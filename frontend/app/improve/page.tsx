'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resumeService } from '@/lib/auth';
import { Sparkles, Plus, X, ArrowRight } from 'lucide-react';

function ImprovePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get('id');
  
  const [issues, setIssues] = useState<string[]>([]);
  const [newIssue, setNewIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [improved, setImproved] = useState('');

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setIssues([...issues, newIssue]);
      setNewIssue('');
    }
  };

  const handleRemoveIssue = (index: number) => {
    setIssues(issues.filter((_, i) => i !== index));
  };

  const handleImprove = async () => {
    if (!resumeId || issues.length === 0) return;

    setLoading(true);
    try {
      const response = await resumeService.improveResume(resumeId, issues);
      setImproved(response.improved);
    } catch (error) {
      console.error('Error improving resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">ResumeForge <span className="text-blue-600">AI</span></h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Resume rewrite</p>
          <h1 className="text-3xl font-bold mt-2 mb-2 text-slate-900">Improve your resume section by section</h1>
          <p className="text-slate-600 mb-6">Add specific issues and generate a clearer, stronger version.</p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Issues to fix</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="Enter an issue to fix"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddIssue()}
              />
              <button
                onClick={handleAddIssue}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-sm text-slate-700">{issue}</span>
                  <button
                    onClick={() => handleRemoveIssue(idx)}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-sm font-semibold"
                  >
                    <X className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleImprove}
            disabled={loading || issues.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-400 mb-8"
          >
            {loading ? 'Improving...' : 'Generate Improved Version'} {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          {improved && (
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
              <h2 className="text-2xl font-bold mb-4 text-emerald-800 inline-flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Improved version
              </h2>
              <div className="bg-white p-4 rounded-lg border border-emerald-200 max-h-96 overflow-y-auto whitespace-pre-wrap text-slate-700">
                {improved}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImprovePage() {
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
      <ImprovePageContent />
    </Suspense>
  );
}
