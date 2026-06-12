import Link from "next/link";
import { Laptop, Smartphone, Tablet, Watch, Headphones, Monitor, Keyboard, Mouse } from "lucide-react";

const cats = [
  { label: "Laptops", icon: Laptop, slug: "LAPTOP" },
  { label: "Phones", icon: Smartphone, slug: "SMARTPHONE" },
  { label: "Tablets", icon: Tablet, slug: "TABLET" },
  { label: "Watches", icon: Watch, slug: "SMARTWATCH" },
  { label: "Headphones", icon: Headphones, slug: "HEADPHONES" },
  { label: "Monitors", icon: Monitor, slug: "MONITOR" },
  { label: "Keyboards", icon: Keyboard, slug: "KEYBOARD" },
  { label: "Mice", icon: Mouse, slug: "MOUSE" },
];

export function Categories() {
  return (
    <section className="border-b py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Browse by category</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {cats.map((c) => (
            <Link key={c.slug} href={`/search?category=${c.slug}`} className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 hover:border-accent transition-colors">
              <c.icon className="h-7 w-7 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
