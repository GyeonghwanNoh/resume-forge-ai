'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resumeService } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { FileText, Upload, Sparkles, Target, PencilLine, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import AppTopbar from '@/components/AppTopbar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ScoreCircle from '@/components/ui/ScoreCircle';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';

interface Resume {
  id: string;
  filename: string;
  created_at: string;
}

interface UsageSummary {
  month: string;
  limits: Record<string, number>;
  usage: Record<string, number>;
  remaining: Record<string, number>;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [resumeData, usageData] = await Promise.allSettled([
          resumeService.listResumes(),
          resumeService.getUsageSummary(),
        ]);

        if (resumeData.status === 'fulfilled') {
          setResumes(resumeData.value);
        }

        if (usageData.status === 'fulfilled') {
          setUsage(usageData.value);
        }
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const latestResume = resumes[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar
        action={
          <button onClick={handleLogout} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Logout
          </button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Dashboard"
          title="Build stronger applications, faster"
          description="Track your resumes, monitor usage, and launch high-quality applications from one workspace."
          actions={<Badge variant="primary">Free plan</Badge>}
        />

        <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Welcome back</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Your application command center</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep momentum: upload your latest resume, check ATS score, then tailor for each role.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Link href="/upload" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Upload className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Upload Resume</p>
          </Link>
          <Link href={latestResume ? `/analyze?id=${latestResume.id}` : '/upload'} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Analyze My Resume</p>
          </Link>
          <Link href={latestResume ? `/analyze-for-job?resumeId=${latestResume.id}` : '/upload'} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Target className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">See How I Compare</p>
          </Link>
          <Link href={latestResume ? `/bullet-rewriter?resumeId=${latestResume.id}` : '/upload'} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <PencilLine className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Improve Bullet Points</p>
          </Link>
          <Link href="/cover-letter" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <FileText className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Generate My Cover Letter</p>
          </Link>
          <Link href="/interview" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-slate-900">Interview Prep</p>
          </Link>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-500">Uploaded resumes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{resumes.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Latest upload</p>
            <p className="mt-2 truncate text-base font-semibold text-slate-900">{latestResume?.filename ?? 'No file uploaded yet'}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Analyses remaining</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{usage?.remaining?.analyses ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Current month</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{usage?.month ?? 'Not available'}</p>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Usage summary</h2>
            <p className="mt-1 text-sm text-slate-500">Understand your monthly activity at a glance.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[['Analyses', 'analyses'], ['Job matches', 'job_matches'], ['Cover letters', 'cover_letters'], ['Interview prep', 'interview_questions']].map(([label, key]) => (
                <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {usage?.usage?.[key] ?? 0} / {usage?.limits?.[key] ?? '∞'}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex items-center justify-center">
            <ScoreCircle
              score={resumes.length > 0 ? Math.min(92, 55 + resumes.length * 8) : 40}
              size="md"
              label="Application readiness"
            />
          </Card>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recent resumes</h2>
                <p className="mt-1 text-sm text-slate-500">Open any file to run analysis or continue improvements.</p>
              </div>
              <Link href="/upload" className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Upload new
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-600">Loading your files...</div>
          ) : resumes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No resumes uploaded yet"
                description="Upload your first resume to unlock ATS scoring, job-match analysis, bullet rewrites, and interview prep workflows."
                ctaLabel="Upload my first resume"
                ctaHref="/upload"
                icon={<BarChart3 className="h-5 w-5" />}
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {resumes.map((resume: Resume) => (
                <div key={resume.id} className="p-6 transition hover:bg-slate-50">
                  <Link href={`/analyze?id=${resume.id}`}>
                    <h3 className="font-semibold text-slate-900">{resume.filename}</h3>
                    <p className="mt-1 text-sm text-slate-500">Uploaded: {formatDate(resume.created_at)}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
