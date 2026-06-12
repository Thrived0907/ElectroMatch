const steps = [
  { n: "01", t: "Tell us your needs", d: "Pick a category, set a budget, and tag your usage." },
  { n: "02", t: "We analyze the catalog", d: "Our hybrid engine filters, scores, and ranks products for you." },
  { n: "03", t: "Get matched", d: "Receive ranked picks with AI-written explanations and trade-offs." },
];
export function HowItWorks() {
  return (
    <section className="border-b py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border bg-card p-6">
              <div className="text-sm text-accent font-mono">{s.n}</div>
              <div className="mt-2 text-xl font-semibold">{s.t}</div>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
