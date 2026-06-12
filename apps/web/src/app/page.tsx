import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Demo } from "@/components/landing/Demo";
import { Trending } from "@/components/landing/Trending";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <HowItWorks />
      <Demo />
      <Trending />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
