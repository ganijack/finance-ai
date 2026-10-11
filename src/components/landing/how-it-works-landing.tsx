"use client";

import { motion } from "framer-motion";
import { QrCode, Bot, BarChart3 } from "lucide-react";

const workflows = [
  {
    icon: QrCode,
    title: "1. Sambungkan Nomor WhatsApp",
    description: "Hubungkan nomor WhatsApp bisnis Anda melalui dashboard. Dalam hitungan menit, bot siap menerima pesan masuk dari pelanggan.",
  },
  {
    icon: Bot,
    title: "2. Pelanggan Dilayani Otomatis",
    description: "Bot mengirimkan katalog produk, menghitung total pesanan, dan membuat link pembayaran QRIS/Transfer secara otomatis 24 jam.",
  },
  {
    icon: BarChart3,
    title: "3. Laporan Keuangan Tercatat Real-Time",
    description: "Setiap transaksi berhasil langsung dicatat ke arus kas harian dan bulanan tanpa perlu input data manual lagi.",
  },
];

export function HowItWorksLanding() {
  return (
    <section className="relative py-20 sm:py-28 bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Alur Kerja Otomasi FinanceAI
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Dari pesan pertama pelanggan hingga pembukuan akhir hari, semua terhubung dalam satu sistem yang rapi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {workflows.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
