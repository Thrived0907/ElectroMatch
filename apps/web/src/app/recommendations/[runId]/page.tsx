"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/utils";

export default function RecsPage() {
  const { runId } = useParams<{ runId: string }>();
  const [data, setData] = useState<any>(null);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    const cached = sessionStorage.getItem(`rec:${runId}`);
    if (cached) setData(JSON.parse(cached));
  }, [runId]);

  function toggleCompare(id: string) {
    setCompare((prev) => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  }

  if (!data) return <div className="container mx-auto p-8">Loading…</div>;
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">Your matches</h1>
      <p className="text-muted-foreground mt-2">{data.products.length} products ranked for you</p>

      {compare.length >= 2 && (
        <div className="sticky top-16 z-40 mt-4 flex items-center justify-between rounded-xl border bg-card p-4">
          <div>{compare.length} selected for comparison</div>
          <Button asChild><Link href={`/compare?ids=${compare.join(",")}`}>Compare →</Link></Button>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((p: any) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-muted">
              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
              <div className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground font-medium">{p.matchScore}% match</div>
            </div>
            <CardContent className="p-5">
              <div className="text-xs text-muted-foreground">{p.brand}</div>
              <div className="mt-1 font-semibold text-lg">{p.name}</div>
              <div className="mt-1 text-xl">{inr(p.price)}</div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.aiExplanation}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" asChild><Link href={`/product/${p.id}`}>Details</Link></Button>
                <Button size="sm" variant="outline" onClick={() => toggleCompare(p.id)}>
                  {compare.includes(p.id) ? "✓ Selected" : "Compare"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
