"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, PieChart, Brain, DollarSign } from "lucide-react";

import ShinyText from "@/components/ShinyText";
import Magnet from "@/components/Magnet";
import Squares from "@/components/Squares";

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Floating glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-zinc-500/20 via-zinc-500/20 to-zinc-500/20 rounded-3xl blur-3xl" />

      {/* Main card */}
      <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 shadow-2xl">
        {/* Top stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Today", amount: "Rp 125.000", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Monthly", amount: "Rp 3.2M", icon: TrendingUp, color: "text-zinc-400", bg: "bg-zinc-500/10" },
            { label: "Saved", amount: "Rp 850K", icon: PieChart, color: "text-zinc-400", bg: "bg-zinc-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/30 bg-background/50 p-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.bg} mb-2`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className="text-xs font-semibold tabular-nums">{stat.amount}</p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="rounded-xl border border-border/30 bg-background/50 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium">Monthly Spending</p>
            <p className="text-[10px] text-muted-foreground">July 2026</p>
          </div>
          <div className="flex items-end gap-1 h-24">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-zinc-500 to-zinc-400/60"
              />
            ))}
          </div>
        </div>

        {/* AI Insights card */}
        <div className="rounded-xl border border-zinc-500/20 bg-gradient-to-r from-zinc-500/5 to-zinc-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600">
              <Brain className="h-3 w-3 text-white" />
            </div>
            <p className="text-xs font-semibold">AI Insights</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your food spending increased by 23% this week. Consider meal prepping to save ~Rp 200K monthly.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

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
          className="absolute -top-40 -right-40 w-96 h-96 bg-zinc-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-zinc-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zinc-500/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/5 text-sm text-zinc-400 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
              Powered by AI
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Take Control of{" "}
              <br className="hidden sm:block" />
              Your Money with{" "}
              <ShinyText
                text="AI"
                speed={3}
                shineColor="#a78bfa"
                color="#818cf8"
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
              Track your expenses effortlessly using AI. Type naturally, upload receipts, and receive intelligent financial insights that help you spend smarter.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 text-white shadow-xl shadow-zinc-500/25 border-0 h-12 px-8 text-base">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base group">
                <Play className="mr-2 h-4 w-4 group-hover:text-zinc-400 transition-colors" />
                View Demo
              </Button>
              <Magnet magnetStrength={3} padding={60}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[160px] h-12 px-8 text-base shadow-sm group" asChild>
                  <Link href="/api/auth/demo">
                    Try Demo
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </Magnet>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {["bg-zinc-500", "bg-zinc-500", "bg-zinc-500", "bg-emerald-500"].map((bg, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-[10px] text-white font-medium`}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">1,200+ users</p>
                <p className="text-xs text-muted-foreground">already tracking smarter</p>
              </div>
            </motion.div>
          </div>

          {/* Right - Dashboard Mockup */}
          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
