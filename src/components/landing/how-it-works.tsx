"use client";

import { motion } from "framer-motion";
import { UserPlus, Receipt, Bot, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Buat Akun",
    description: "Daftar dalam beberapa detik. Akses langsung seluruh fitur pembukuan bisnis Anda.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Hubungkan WhatsApp",
    description: "Scan QR untuk menghubungkan nomor bisnis Anda agar bot dapat melayani chat otomatis.",
    icon: Bot,
  },
  {
    step: "03",
    title: "Catat Pengeluaran & Struk",
    description: "Ketik transaksi pengeluaran atau unggah foto struk belanja untuk rekap otomatis.",
    icon: Receipt,
  },
  {
    step: "04",
    title: "Pantau Laporan Bisnis",
    description: "Lihat arus kas, profit, dan insight keuangan harian langsung di dashboard.",
    icon: BarChart3,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Mulai dalam <span className="text-blue-600 dark:text-blue-400">4 Langkah Mudah</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Dari pendaftaran hingga otomatisasi penuh, semua siap dalam hitungan menit.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[27px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-[2px] bg-border" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.step}
                  className="relative"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden flex items-start gap-5">
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="pt-1">
                      <span className="text-xs font-mono text-muted-foreground">Langkah {step.step}</span>
                      <h3 className="text-lg font-semibold mt-0.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr,56px,1fr] items-center gap-4">
                    {/* Left content */}
                    <div className={`${isEven ? "text-right" : "order-3 text-left"}`}>
                      <span className="text-xs font-mono text-muted-foreground">Langkah {step.step}</span>
                      <h3 className="text-lg font-semibold mt-0.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                    </div>

                    {/* Center icon */}
                    <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm ${isEven ? "" : "order-2"}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Empty space */}
                    <div className={isEven ? "order-3" : ""} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
