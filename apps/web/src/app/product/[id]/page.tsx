"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    api<any>(`/products/${id}`).then(setP);
    api<{ items: any[] }>(`/products/${id}/price-history`).then((r) => setHistory(r.items));
    api<{ items: any[] }>(`/products/${id}/similar`).then((r) => setSimilar(r.items));
  }, [id]);

  if (!p) return <div className="container mx-auto p-8">Loading…</div>;
  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{p.brand?.name}</div>
        <h1 className="text-3xl font-semibold">{p.name}</h1>
        <div className="mt-2 text-2xl">{inr(p.price)}</div>
        <p className="mt-4 text-muted-foreground">{p.description}</p>

        <h3 className="mt-6 font-semibold">Specifications</h3>
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {p.specs?.map((s: any) => (<div key={s.id} className="contents"><dt className="text-muted-foreground">{s.key}</dt><dd>{s.value}</dd></div>))}
        </dl>

        <div className="mt-6 flex gap-3">
          <Button onClick={() => api("/wishlist", { method: "POST", body: JSON.stringify({ productId: p.id }) })}>Save to wishlist</Button>
          <Button variant="outline">Set price alert</Button>
        </div>

        {history.length > 1 && (
          <div className="mt-8">
            <h3 className="font-semibold">Price history</h3>
            <div className="h-40 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="recordedAt" hide />
                  <YAxis hide domain={["dataMin","dataMax"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <div className="md:col-span-2">
          <h3 className="font-semibold text-xl">Similar products</h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((s: any) => (
              <a key={s.id} href={`/product/${s.id}`} className="rounded-xl border bg-card p-4 hover:border-accent">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-muted-foreground">{inr(s.price)}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
