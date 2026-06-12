"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";

export function Demo() {
  const [q, setQ] = useState("lightweight laptop under ₹80,000 for programming");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function run() {
    setLoading(true); setResult(null);
    try { setResult(await api("/recommend/nlp", { method: "POST", body: JSON.stringify({ query: q }) })); }
    catch (e: any) { setResult({ error: e.message }); }
    finally { setLoading(false); }
  }

  return (
    <section className="border-b py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold tracking-tight">See it in action</h2>
        <p className="mt-2 text-muted-foreground">Type what you need in plain English.</p>
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 h-12 rounded-md border bg-background px-4" />
          <Button onClick={run} disabled={loading} size="lg">{loading ? "Thinking..." : "Recommend"}</Button>
        </div>
        {result?.products && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {result.products.slice(0, 3).map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-6">
                  <div className="text-sm text-accent">{p.matchScore}% match</div>
                  <div className="mt-1 font-semibold">{p.brand} {p.name}</div>
                  <div className="mt-1 text-muted-foreground">{inr(p.price)}</div>
                  <p className="mt-3 text-sm">{p.aiExplanation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
