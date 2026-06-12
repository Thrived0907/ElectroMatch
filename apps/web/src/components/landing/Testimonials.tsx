const items = [
  { q: "Saved me 3 weeks of research. Bought exactly what it suggested.", a: "Aarav, Bengaluru" },
  { q: "The compare AI is uncanny — caught a thermal issue I'd missed.", a: "Sneha, Pune" },
  { q: "Finally, a tool that thinks like a power user.", a: "Rahul, Delhi" },
];
export function Testimonials() {
  return (
    <section className="border-b py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold tracking-tight">Loved by buyers</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <p>"{t.q}"</p>
              <div className="mt-3 text-sm text-muted-foreground">— {t.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
