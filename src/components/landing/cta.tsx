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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Gradient orbs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px]" />

          {/* Content */}
          <div className="relative text-center py-16 sm:py-20 px-6 sm:px-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 mb-6"
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Start Managing Your Money{" "}
              <ShinyText
                text="Smarter"
                speed={3}
                shineColor="#f0abfc"
                color="#a78bfa"
                spread={90}
                className="text-3xl sm:text-4xl font-bold"
              />
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join FinanceAI and let artificial intelligence organize your finances. Free to start, powerful to grow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 border-0 h-12 px-8 text-base">
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                  <Link href="/login">Login</Link>
                </Button>
              </Magnet>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
