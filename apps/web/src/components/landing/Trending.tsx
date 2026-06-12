export function Trending() {
  return (
    <section className="border-b py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold tracking-tight">Trending now</h2>
        <p className="mt-2 text-muted-foreground">Most viewed, compared and saved this week.</p>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {["MacBook Air M3","iPhone 15 Pro","Sony WH-1000XM5","OnePlus 12"].map((n) => (
            <div key={n} className="rounded-xl border bg-card p-6">
              <div className="text-xs text-muted-foreground">Top pick</div>
              <div className="mt-2 font-semibold">{n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
