"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, QrCode, BrainCircuit, Receipt } from "lucide-react";
import ShinyText from "@/components/ShinyText";

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
    description: "Pelanggan bisa langsung membayar via QRIS, Virtual Account, atau E-Wallet (GoPay, OVO, Dana). Pesanan akan otomatis batal jika tidak dibayar dalam 30 menit (Anti-Ghosting).",
    icon: QrCode,
    image: "/landing-payment.jpg",
    reversed: true,
  },
  {
    title: "Dashboard Keuangan AI",
    description: "Setiap pesanan yang dibayar otomatis tercatat sebagai pendapatan. Pantau arus kas harian, mingguan, dan bulanan dengan visualisasi data yang mudah dipahami.",
    icon: BrainCircuit,
    image: "/landing-dashboard.jpg",
    reversed: false,
    aspectRatio: "aspect-[16/9]"
  },
  {
    title: "Catat Pengeluaran dengan Foto Struk",
    description: "Habis belanja bahan baku? Cukup foto struk belanja Anda, dan AI kami akan otomatis mengekstrak rincian barang, harga, dan total belanjaan ke dalam laporan pengeluaran.",
    icon: Receipt,
    image: "/landing-scan.jpg",
    reversed: true,
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden bg-slate-50/50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Satu Sistem untuk{" "}
            <ShinyText
              text="Semua Kebutuhan"
              speed={4}
              shineColor="#93c5fd"
              color="#3b82f6"
              spread={100}
              className="text-3xl sm:text-4xl font-bold"
            />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Mulai dari urusan penjualan hingga pembukuan, FinanceAI menangani semuanya secara otomatis.
          </p>
        </motion.div>

        {/* Feature Blocks */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = feature.reversed;

            return (
              <div
                key={index}
                className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}
              >
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="flex-1 space-y-6 text-center md:text-left"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>

                {/* Image/Mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 w-full max-w-md mx-auto md:max-w-none relative"
                >
                  {/* Decorative background blob */}
                  <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full" />

                  <div className={`relative w-full ${feature.aspectRatio || 'max-w-[320px] aspect-[3/4] mx-auto'} rounded-2xl border-4 border-border/50 bg-card overflow-hidden shadow-2xl`}>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
