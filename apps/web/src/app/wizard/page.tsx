"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const CATEGORIES = ["LAPTOP","SMARTPHONE","TABLET","SMARTWATCH","HEADPHONES"] as const;
const USAGE: Record<string, string[]> = {
  LAPTOP: ["Programming","Gaming","AI/ML","College","Business","Video Editing"],
  SMARTPHONE: ["Photography","Gaming","Social Media","Battery Life"],
  TABLET: ["Note-taking","Drawing","Media","Productivity"],
  SMARTWATCH: ["Fitness","Notifications","Health","Style"],
  HEADPHONES: ["Music","Calls","Gaming","Noise cancelling","Travel"],
};
const PREFS = ["Battery","Weight","Performance","Camera","Display","Portability","Charging Speed"];
const BUDGETS = [[20000,40000],[40000,60000],[60000,80000],[80000,200000]];

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<typeof CATEGORIES[number] | null>(null);
  const [budget, setBudget] = useState<[number, number] | null>(null);
  const [usage, setUsage] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggle<T>(arr: T[], v: T) { return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]; }

  async function submit() {
    if (!category || !budget) return;
    setLoading(true);
    try {
      const res = await api<{ runId: string }>("/recommend", {
        method: "POST",
        body: JSON.stringify({ category, budgetMin: budget[0], budgetMax: budget[1], usage, preferences: prefs }),
      });
      sessionStorage.setItem(`rec:${res.runId}`, JSON.stringify(res));
      router.push(`/recommendations/${res.runId}`);
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-sm text-muted-foreground">Step {step + 1} of 4</div>
      <div className="mt-2 h-1 bg-muted rounded">
        <div className="h-1 bg-accent rounded transition-all" style={{ width: `${(step + 1) * 25}%` }} />
      </div>

      <Card className="mt-8">
        <CardContent className="p-8">
          {step === 0 && (
            <>
              <h2 className="text-2xl font-semibold">What are you looking for?</h2>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`rounded-xl border p-4 text-left hover:border-accent transition-colors ${category === c ? "border-accent bg-accent/10" : ""}`}>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold">What's your budget?</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {BUDGETS.map((b) => (
                  <button key={b.join("-")} onClick={() => setBudget(b as [number,number])} className={`rounded-xl border p-4 hover:border-accent ${budget?.[0] === b[0] ? "border-accent bg-accent/10" : ""}`}>
                    ₹{b[0].toLocaleString("en-IN")} – ₹{b[1].toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && category && (
            <>
              <h2 className="text-2xl font-semibold">Primary usage</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {(USAGE[category] ?? []).map((u) => (
                  <button key={u} onClick={() => setUsage(toggle(usage, u))} className={`rounded-full border px-4 py-2 text-sm hover:border-accent ${usage.includes(u) ? "border-accent bg-accent/10" : ""}`}>{u}</button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold">What matters most?</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {PREFS.map((p) => (
                  <button key={p} onClick={() => setPrefs(toggle(prefs, p))} className={`rounded-full border px-4 py-2 text-sm hover:border-accent ${prefs.includes(p) ? "border-accent bg-accent/10" : ""}`}>{p}</button>
                ))}
              </div>
            </>
          )}

          <div className="mt-10 flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={(step === 0 && !category) || (step === 1 && !budget) || (step === 2 && usage.length === 0)}>Next</Button>
            ) : (
              <Button onClick={submit} disabled={loading}>{loading ? "Finding your matches..." : "Show recommendations"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
