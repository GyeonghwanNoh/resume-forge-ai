"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resumeService } from "@/lib/auth";
import { Edit, Sparkles, Plus, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";
import AppTopbar from "@/components/AppTopbar";
import PageHeader from "@/components/ui/PageHeader";

export default function BulletRewriter() {
  const router = useRouter();
  const [bullets, setBullets] = useState(["", "", ""]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setBullets(newBullets);
  };

  const handleAddBullet = () => {
    if (bullets.length >= 6) {
      showToast("You can rewrite up to 6 bullets at once", "warning");
      return;
    }
    setBullets([...bullets, ""]);
  };

  const handleRemoveBullet = (index: number) => {
    if (bullets.length <= 1) return;
    setBullets(bullets.filter((_, idx) => idx !== index));
  };

  const handleRewrite = async () => {
    const filledBullets = bullets.filter(b => b.trim());
    if (filledBullets.length === 0) {
      showToast("Please add at least one bullet point", "warning");
      return;
    }

    setLoading(true);
    try {
      const data = await resumeService.rewriteBullets(filledBullets);
      setResult(data);
      showToast("Bullets rewritten successfully!", "success");
    } catch (error: any) {
      if (error.response?.status === 429) {
        showToast("Free tier limit reached. Upgrade to continue.", "error");
      } else {
        showToast("Rewrite failed. Please try again.", "error");
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
          eyebrow="Bullet rewriter"
          title="Turn weak bullet points into credible impact statements"
          description="Add rough bullets from projects or internships and get stronger, outcome-oriented alternatives."
        />

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Your current bullets</h2>
          {bullets.map((bullet, idx) => (
            <div key={idx} className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Bullet Point {idx + 1}
                </label>
                {bullets.length > 1 && (
                  <button type="button" onClick={() => handleRemoveBullet(idx)} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="e.g., Worked on backend development"
                value={bullet}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
              />
            </div>
          ))}

          <button type="button" onClick={handleAddBullet} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <Plus className="h-4 w-4" /> Add bullet
          </button>

          <button
            onClick={handleRewrite}
            disabled={loading || bullets.every(b => !b.trim())}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : <><Sparkles className="h-5 w-5" /> Rewrite with AI</>}
          </button>
        </div>

        {result && result.rewritten && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Before and after</h2>
            {bullets.filter(b => b.trim()).map((originalBullet, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-600">❌ BEFORE</h3>
                    <p className="rounded border border-rose-200 bg-rose-50 p-4 text-slate-700">{originalBullet}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-600">✅ AFTER</h3>
                    <p className="rounded border border-emerald-200 bg-emerald-50 p-4 font-medium text-slate-900">{result.rewritten[idx]}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
              <h3 className="mb-2 font-bold text-slate-900">💡 Pro tips</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Use strong action verbs: Architected, Optimized, Deployed</li>
                <li>• Add metrics: "Increased by 30%", "Handled 10K+ requests"</li>
                <li>• Show impact: What problem did you solve?</li>
              </ul>
            </div>

            <button onClick={() => router.push("/dashboard")} className="w-full rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
