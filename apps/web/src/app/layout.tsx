import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "ElectroMatch AI — Find your perfect device",
  description: "AI-powered electronics recommendations for India. Laptops, phones, tablets, headphones and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <html lang="en" className="dark">
        <body>
          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </body>
      </html>
   
  );
}
