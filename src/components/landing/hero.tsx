"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6"
            >
              Kelola Bisnis Lebih Rapi dengan{" "}
              <br className="hidden sm:block" />
              WhatsApp &amp;{" "}
              <span className="text-blue-600 dark:text-blue-400">AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Otomatisasi pencatatan transaksi, konfirmasi pembayaran, dan laporan keuangan bisnis langsung dari percakapan WhatsApp Anda.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Button size="lg" asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 px-8 text-base shadow-sm">
                <Link href="/register">
                  Coba Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/how-it-works">
                  Lihat Cara Kerja
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right - Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2rem] border border-border bg-card overflow-hidden shadow-xl">
              <Image 
                src="/landing-hero.jpg" 
                alt="FinanceAI WhatsApp Bot Demo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating info badges */}
            <div className="absolute -right-6 top-16 bg-card/95 border border-border rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-semibold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold">Pesanan Masuk</p>
                  <p className="text-[10px] text-muted-foreground">Otomatis diproses</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-24 bg-card/95 border border-border rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-semibold text-xs">
                  Rp
                </div>
                <div>
                  <p className="text-xs font-semibold">Tercatat ke Laporan</p>
                  <p className="text-[10px] text-muted-foreground">Sinkronisasi langsung</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
