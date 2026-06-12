const qs = [
  ["Is it free?", "Yes, ElectroMatch AI is free to use. We may earn affiliate commissions."],
  ["How accurate are recommendations?", "We combine rule-based filtering with AI ranking and explanations using GPT-4o-mini."],
  ["Do you support international pricing?", "V1 focuses on India (INR). Multi-region is on the roadmap."],
];
export function FAQ() {
  return (
    <section className="border-b py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-6 space-y-4">
          {qs.map(([q, a]) => (
            <details key={q} className="rounded-xl border bg-card p-5">
              <summary className="font-medium cursor-pointer">{q}</summary>
              <p className="mt-2 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
