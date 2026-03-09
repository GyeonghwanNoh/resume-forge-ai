"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resumeService } from "@/lib/auth";
import { TrendingUp, AlertCircle, ArrowRight, CheckCircle2, Info } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";
import AppTopbar from "@/components/AppTopbar";
import PageHeader from "@/components/ui/PageHeader";
import ScoreCircle from "@/components/ui/ScoreCircle";
import Badge from "@/components/ui/Badge";

function AnalyzeForJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId") ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleAnalyze = async () => {
    if (!resumeId || !jobDescription.trim()) {
      showToast("Please provide a job description", "warning");
      return;
    }

    setLoading(true);
    try {
      const data = await resumeService.analyzeForJob(resumeId, jobDescription);
      setResult(data);
      showToast("Job match analysis completed!", "success");
    } catch (error: any) {
      if (error.response?.status === 429) {
        showToast("Free tier limit reached. Upgrade to continue.", "error");
      } else {
        showToast("Analysis failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopbar />
      {ToastComponent}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <PageHeader
          eyebrow="Job match analysis"
          title="Compare your resume to a target role"
          description="Get ATS match score, missing keyword badges, and a focused checklist before you apply."
        />

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Resume ID
            </label>
            <input
              className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Paste your resume ID"
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
            />

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Paste Job Description
            </label>
            <textarea
              className="h-48 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Paste the full job description here...&#10;&#10;Example: We're looking for a Software Engineer with experience in Python, REST APIs, Docker..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : <>Analyze Job Match <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">How to get better match scores</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 text-indigo-600" />Include exact technologies from the job post.</li>
              <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 text-indigo-600" />Use impact metrics in 2-3 bullets per role.</li>
              <li className="flex gap-2"><Info className="mt-0.5 h-4 w-4 text-indigo-600" />Mirror role wording in your summary and experience.</li>
            </ul>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-indigo-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Match score</h2>
                  <p className="text-slate-600">How well your resume aligns with this role right now</p>
                </div>
                <ScoreCircle score={result.match_score ?? 0} size="sm" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Keywords Found in Your Resume
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.found_keywords && result.found_keywords.length > 0 ? (
                  result.found_keywords.map((keyword: string, idx: number) => (
                    <Badge key={idx} variant="success">✓ {keyword}</Badge>
                  ))
                ) : (
                  <p className="text-slate-600">No keywords found</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords && result.missing_keywords.length > 0 ? (
                  result.missing_keywords.map((keyword: string, idx: number) => (
                    <Badge key={idx} variant="warning">{keyword}</Badge>
                  ))
                ) : (
                  <p className="text-green-600">Great! Your resume includes all key terms.</p>
                )}
              </div>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
                <h3 className="mb-3 text-lg font-bold text-slate-900">Improvement checklist</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-indigo-600" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <button onClick={() => router.push("/dashboard")} className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                Back to Dashboard
              </button>
              <button onClick={() => router.push(`/bullet-rewriter?resumeId=${resumeId}`)} className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                Improve Bullet Points →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzeForJob() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-base font-medium text-slate-700">Loading job analysis...</p>
          </div>
        </div>
      }
    >
      <AnalyzeForJobContent />
    </Suspense>
  );
}
