"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";

export default function ComparePage() {
  const sp = useSearchParams();
  const ids = (sp.get("ids") ?? "").split(",").filter(Boolean);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (ids.length < 2) return;
    api<any>("/compare", { method: "POST", body: JSON.stringify({ productIds: ids }) }).then(setData);
  }, [ids.join(",")]);

  if (ids.length < 2) return <div className="container mx-auto p-8">Pick 2-4 products from recommendations to compare.</div>;
  if (!data) return <div className="container mx-auto p-8">Comparing…</div>;

  const allKeys = Array.from(new Set(data.products.flatMap((p: any) => p.specs.map((s: any) => s.key))));
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">Compare</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead><tr className="bg-muted/40">
            <th className="text-left p-3">Spec</th>
            {data.products.map((p: any) => (<th key={p.id} className="text-left p-3">{p.brand.name} {p.name}<div className="font-normal text-sm">{inr(p.price)}</div></th>))}
          </tr></thead>
          <tbody>
            {allKeys.map((k) => (
              <tr key={String(k)} className="border-t">
                <td className="p-3 text-muted-foreground">{String(k)}</td>
                {data.products.map((p: any) => (<td key={p.id} className="p-3">{p.specs.find((s: any) => s.key === k)?.value ?? "—"}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">AI verdict</h2>
        <p className="mt-2">{data.ai?.verdict}</p>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
          {Object.entries(data.ai ?? {}).filter(([k]) => k.startsWith("best")).map(([k,v]: any) => {
            const winner = data.products.find((p: any) => p.id === v);
            return <div key={k} className="rounded-lg border p-3"><div className="text-muted-foreground">{k}</div><div className="font-medium">{winner ? `${winner.brand.name} ${winner.name}` : String(v)}</div></div>;
          })}
        </div>
      </div>
    </div>
  );
}
