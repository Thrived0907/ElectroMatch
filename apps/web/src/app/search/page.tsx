"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";
import Link from "next/link";

export default function SearchPage() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [items, setItems] = useState<any[]>([]);
  const category = sp.get("category") ?? undefined;

  async function run() {
    const params = new URLSearchParams({ q, ...(category ? { category } : {}) });
    const res = await api<{ items: any[] }>(`/search?${params}`);
    setItems(res.items);
  }
  useEffect(() => { run(); }, [category]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Search…" className="flex-1 h-12 rounded-md border bg-background px-4" />
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {items.map((p: any) => (
          <Link key={p.id} href={`/product/${p.id}`} className="rounded-xl border bg-card p-5 hover:border-accent">
            <div className="text-xs text-muted-foreground">{p.brand}</div>
            <div className="font-semibold mt-1">{p.name}</div>
            <div className="mt-1">{inr(p.price)}</div>
          </Link>
        ))}
        {!items.length && <div className="text-muted-foreground">No results yet. Try a search.</div>}
      </div>
    </div>
  );
}
