"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

import ShinyText from "@/components/ShinyText";
import Magnet from "@/components/Magnet";
import Squares from "@/components/Squares";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Squares Background */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_50%,transparent_100%)]">
          <Squares 
            direction="diagonal"
            speed={0.5}
            squareSize={40}
            borderColor="hsl(var(--border) / 0.2)"
            hoverFillColor="hsl(var(--primary) / 0.05)"
          />
        </div>

        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">


            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Kelola Bisnis Lebih Cerdas dengan{" "}
              <br className="hidden sm:block" />
              WhatsApp &{" "}
              <ShinyText
                text="AI"
                speed={3}
                shineColor="#93c5fd"
                color="#3b82f6"
                spread={90}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Ubah WhatsApp bisnis Anda menjadi Admin & Kasir otomatis 24 Jam. Dilengkapi pembukuan cerdas berbasis AI untuk kemudahan melacak pendapatan & pengeluaran.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/25 border-0 h-12 px-8 text-base">
                  <Link href="/register">
                    Coba gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
            </motion.div>
          </div>

          {/* Right - Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center relative"
          >
            {/* Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full" />
            
            <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] border-8 border-border/50 bg-background overflow-hidden shadow-2xl">
              <Image 
                src="/landing-hero.jpg" 
                alt="FinanceAI WhatsApp Bot Demo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating badges */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -right-8 top-20 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-500 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">Pesanan Masuk</p>
                  <p className="text-[10px] text-muted-foreground">Otomatis diproses</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -left-12 bottom-32 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 text-sm font-bold">Rp</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">Tercatat ke Laporan</p>
                  <p className="text-[10px] text-muted-foreground">Real-time sync</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
