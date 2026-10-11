"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, QrCode, BarChart3, Receipt } from "lucide-react";

const features = [
  {
    title: "Admin WhatsApp 24 Jam Non-stop",
    description: "Tinggalkan cara manual membalas chat. FinanceAI secara otomatis membalas pesanan pelanggan dengan katalog menu interaktif langsung di dalam WhatsApp.",
    icon: MessageCircle,
    image: "/landing-hero.jpg",
    reversed: false,
  },
  {
    title: "Pembayaran Otomatis & Cepat",
    description: "Pelanggan bisa langsung membayar via QRIS, Virtual Account, atau E-Wallet (GoPay, OVO, Dana). Pesanan akan otomatis dibatalkan jika tidak dibayar dalam batas waktu yang ditentukan.",
    icon: QrCode,
    image: "/landing-payment.jpg",
    reversed: true,
  },
  {
    title: "Dashboard Keuangan & Laporan",
    description: "Setiap pesanan yang dibayar otomatis tercatat sebagai pendapatan. Pantau arus kas harian, mingguan, dan bulanan dengan visualisasi data yang mudah dipahami.",
    icon: BarChart3,
    image: "/landing-dashboard.jpg",
    reversed: false,
    aspectRatio: "aspect-[16/9]"
  },
  {
    title: "Catat Pengeluaran dengan Foto Struk",
    description: "Habis belanja bahan baku? Cukup foto struk belanja Anda, dan sistem akan mengekstrak rincian barang, harga, dan total belanjaan ke dalam laporan pengeluaran.",
    icon: Receipt,
    image: "/landing-scan.jpg",
    reversed: true,
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Satu Sistem untuk{" "}
            <span className="text-blue-600 dark:text-blue-400">Semua Kebutuhan Bisnis</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Mulai dari urusan penjualan WhatsApp hingga pembukuan keuangan, semuanya terintegrasi dengan rapi.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-20 md:space-y-28">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = feature.reversed;

            return (
              <div
                key={feature.title}
                className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 lg:gap-16`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image/Mockup */}
                <div className="flex-1 w-full max-w-md mx-auto md:max-w-none relative">
                  <div className={`relative w-full ${feature.aspectRatio || 'max-w-[320px] aspect-[3/4] mx-auto'} rounded-2xl border border-border bg-card overflow-hidden shadow-lg`}>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
