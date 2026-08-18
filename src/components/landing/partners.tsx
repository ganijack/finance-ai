"use client";

import { motion } from "framer-motion";

const partners = [
  "Midtrans",
  "Meta",
  "WhatsApp",
  "Vercel",
  "Supabase",
  "Google AI"
];

export function PartnersSection() {
  return (
    <section className="py-10 border-b border-border/50 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6">
          Didukung oleh teknologi kelas dunia
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, i) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-lg font-bold text-foreground/80 tracking-tighter"
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
