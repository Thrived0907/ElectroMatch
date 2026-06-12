"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),transparent_60%)]" />
      <div className="container mx-auto px-4 py-24 md:py-32 text-center">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-bold tracking-tight">
          Find your perfect device.<br /><span className="text-accent">Powered by AI.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Skip endless reviews. Tell us what you need and we'll recommend laptops, phones, headphones and more — tailored to your budget and use-case.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild><Link href="/wizard">Start the wizard →</Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="/chat">Try the AI chat</Link></Button>
        </motion.div>
      </div>
    </section>
  );
}
