'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeService } from '@/lib/auth';
import { ArrowRight, FileUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AppTopbar from '@/components/AppTopbar';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const response = await resumeService.uploadResume(file);
      router.push(`/analyze?id=${response.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <PageHeader
          eyebrow="Step 1"
          title="Upload your resume"
          description="Start with your current resume. You will get ATS score, clarity feedback, and practical improvements in minutes."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
          
            {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="mx-auto mb-3 inline-flex rounded-xl bg-indigo-100 p-3">
                    <FileUp className="h-7 w-7 text-indigo-700" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Drop your resume here or click to upload</p>
                  <p className="text-slate-500 text-sm mt-1">Supported formats: PDF, DOCX, TXT</p>
                  {file && <p className="text-emerald-700 font-semibold mt-3">Selected: {file.name}</p>}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-400"
              >
                {loading ? 'Uploading...' : 'Analyze My Resume'} {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-indigo-600" />
                <p>Your resume is only used to generate your requested analysis and writing outputs.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-slate-900">What you get next</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> ATS score and clarity analysis</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Weak bullet point detection</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> Suggested improvements and next actions</li>
            </ul>

            <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Tip</p>
              <p className="mt-1 text-sm text-slate-700">For best results, upload your latest resume version before tailoring for a specific role.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
