"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Magnet from "@/components/Magnet";
import ShinyText from "@/components/ShinyText";

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/50"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-indigo-500/10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Gradient orbs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px]" />

          {/* Content */}
          <div className="relative text-center py-16 sm:py-20 px-6 sm:px-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/25 mb-6"
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Mulai Kelola Bisnis Anda{" "}
              <ShinyText
                text="Sekarang Juga"
                speed={3}
                shineColor="#93c5fd"
                color="#3b82f6"
                spread={90}
                className="text-3xl sm:text-4xl font-bold"
              />
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Bergabunglah dengan FinanceAI dan biarkan kecerdasan buatan mengurus pesanan dan pembukuan Anda. Coba gratis sekarang!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-xl shadow-blue-500/25 border-0 h-12 px-8 text-base">
                  <Link href="/register">
                    Buat Akun Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                  <Link href="/login">Masuk</Link>
                </Button>
              </Magnet>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
