"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { inr } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { getToken, isSignedIn } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      const t = await getToken();
      setData(await api("/dashboard", {}, t ?? undefined));
    })();
  }, [isSignedIn]);

  if (!isSignedIn) return <div className="container mx-auto p-8">Sign in to view your dashboard.</div>;
  if (!data) return <div className="container mx-auto p-8">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <section>
        <h2 className="text-2xl font-semibold">Wishlist</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {data.wishlist.map((w: any) => (
            <Link key={w.id} href={`/product/${w.product.id}`} className="rounded-xl border bg-card p-4 hover:border-accent">
              <div className="font-medium">{w.product.name}</div>
              <div className="text-muted-foreground">{inr(w.product.price)}</div>
            </Link>
          ))}
          {!data.wishlist.length && <div className="text-muted-foreground">Nothing saved yet.</div>}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Price alerts</h2>
        <div className="mt-4 space-y-2">
          {data.alerts.map((a: any) => (
            <div key={a.id} className="rounded-lg border p-3 flex justify-between">
              <span>{a.product.name}</span>
              <span className="text-muted-foreground">notify under {inr(a.threshold)}</span>
            </div>
          ))}
          {!data.alerts.length && <div className="text-muted-foreground">No active alerts.</div>}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Recent recommendations</h2>
        <div className="mt-4 text-muted-foreground">{data.recs.length} runs</div>
      </section>
    </div>
  );
}
