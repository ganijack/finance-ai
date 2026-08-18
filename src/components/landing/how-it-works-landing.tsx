"use client";

import { motion } from "framer-motion";
import { UserPlus, Smartphone, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Daftar & Hubungkan",
    description: "Buat akun FinanceAI, lalu scan QR Code untuk menghubungkan nomor WhatsApp bisnis Anda dengan sistem kami dalam hitungan detik.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Otomatisasi Berjalan",
    description: "Pelanggan Anda mulai chat, melihat katalog, dan membayar secara mandiri 24 jam tanpa perlu Anda pantau secara manual.",
    icon: Smartphone,
  },
  {
    number: "03",
    title: "Pantau Hasilnya",
    description: "Buka dashboard FinanceAI di HP atau laptop Anda untuk melihat laporan penjualan harian dan analisa keuangan cerdas dari AI.",
    icon: LineChart,
  },
];

export function HowItWorksLanding() {
  return (
    <section className="relative py-24 bg-card border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Kerja FinanceAI</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tiga langkah mudah untuk mengotomatisasi operasional dan keuangan bisnis Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-background border-8 border-card flex items-center justify-center shadow-lg mb-6 relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full" />
                  <Icon className="h-8 w-8 text-blue-500 relative z-10" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
