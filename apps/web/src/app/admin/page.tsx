"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export default function AdminPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      try { setStats(await api("/admin/stats", {}, t ?? undefined)); }
      catch (e: any) { setError(e.message); }
    })();
  }, []);

  if (error) return <div className="container mx-auto p-8">Access denied: {error}</div>;
  if (!stats) return <div className="container mx-auto p-8">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <div className="mt-6 grid md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-2xl font-semibold mt-1">{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
