"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Brain,
  BarChart3,
  DollarSign,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const screenshots = [
  {
    title: "Dashboard",
    description: "Complete financial overview at a glance",
    icon: LayoutDashboard,
    gradient: "from-zinc-500 to-blue-600",
    content: (
      <div className="p-4 space-y-3">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Today", value: "Rp 85K", icon: DollarSign, change: "-12%", up: false },
            { label: "Month", value: "Rp 2.4M", icon: TrendingUp, change: "+8%", up: true },
            { label: "Saved", value: "Rp 600K", icon: PieChart, change: "+15%", up: true },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-background/60 border border-border/30 p-2.5">
              <s.icon className="h-3 w-3 text-muted-foreground mb-1.5" />
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
              <p className="text-[11px] font-bold">{s.value}</p>
              <div className={`flex items-center gap-0.5 mt-0.5 ${s.up ? "text-emerald-400" : "text-rose-400"}`}>
                {s.up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                <span className="text-[8px] font-medium">{s.change}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Mini chart */}
        <div className="rounded-lg bg-background/60 border border-border/30 p-3">
          <p className="text-[9px] font-medium mb-2">Spending Trend</p>
          <div className="flex items-end gap-0.5 h-14">
            {[35, 55, 40, 70, 50, 65, 80, 45, 60, 75, 55, 40].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-zinc-500 to-zinc-400/50" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Transactions",
    description: "Track every expense with ease",
    icon: Receipt,
    gradient: "from-emerald-500 to-teal-600",
    content: (
      <div className="p-4 space-y-2">
        {[
          { name: "Grab Food", cat: "Food", amount: "Rp 45.000", color: "bg-orange-400" },
          { name: "Netflix", cat: "Subscription", amount: "Rp 54.000", color: "bg-zinc-400" },
          { name: "Coffee Shop", cat: "Food", amount: "Rp 32.000", color: "bg-amber-400" },
          { name: "Electricity", cat: "Bills", amount: "Rp 380.000", color: "bg-blue-400" },
          { name: "Gym Monthly", cat: "Health", amount: "Rp 250.000", color: "bg-rose-400" },
        ].map((tx) => (
          <div key={tx.name} className="flex items-center gap-2.5 rounded-lg bg-background/60 border border-border/30 p-2.5">
            <div className={`h-7 w-7 rounded-lg ${tx.color}/10 flex items-center justify-center`}>
              <div className={`h-2.5 w-2.5 rounded-full ${tx.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate">{tx.name}</p>
              <p className="text-[8px] text-muted-foreground">{tx.cat}</p>
            </div>
            <p className="text-[10px] font-semibold tabular-nums">{tx.amount}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "AI Insights",
    description: "Smart recommendations powered by AI",
    icon: Brain,
    gradient: "from-zinc-500 to-zinc-600",
    content: (
      <div className="p-4 space-y-2.5">
        {[
          { title: "Spending Alert", text: "Food expenses up 23% this week. Try meal prep.", type: "warning" },
          { title: "Saving Opportunity", text: "Cancel unused subscriptions to save Rp 120K/month.", type: "tip" },
          { title: "Monthly Summary", text: "You're 15% under budget this month. Great job!", type: "success" },
        ].map((insight) => (
          <div
            key={insight.title}
            className={`rounded-lg border p-3 ${
              insight.type === "warning" ? "border-amber-500/20 bg-amber-500/5" :
              insight.type === "tip" ? "border-zinc-500/20 bg-zinc-500/5" :
              "border-emerald-500/20 bg-emerald-500/5"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Brain className={`h-3 w-3 ${
                insight.type === "warning" ? "text-amber-400" :
                insight.type === "tip" ? "text-zinc-400" :
                "text-emerald-400"
              }`} />
              <p className="text-[10px] font-semibold">{insight.title}</p>
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Analytics",
    description: "Visualize spending with rich charts",
    icon: BarChart3,
    gradient: "from-cyan-500 to-blue-600",
    content: (
      <div className="p-4 space-y-3">
        {/* Donut placeholder */}
        <div className="flex items-center justify-center py-2">
          <div className="relative h-20 w-20">
            <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-border/30" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="35 65" strokeLinecap="round" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="url(#gradient2)" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-35" strokeLinecap="round" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="url(#gradient3)" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-60" strokeLinecap="round" />
              <defs>
                <linearGradient id="gradient1"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#818cf8" /></linearGradient>
                <linearGradient id="gradient2"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
                <linearGradient id="gradient3"><stop stopColor="#ec4899" /><stop offset="1" stopColor="#f472b6" /></linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold">Rp 2.4M</span>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="space-y-1.5">
          {[
            { name: "Food & Drink", pct: "35%", color: "bg-zinc-400" },
            { name: "Transport", pct: "25%", color: "bg-zinc-400" },
            { name: "Bills", pct: "20%", color: "bg-zinc-400" },
            { name: "Other", pct: "20%", color: "bg-muted-foreground" },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${c.color}`} />
                <span className="text-[9px]">{c.name}</span>
              </div>
              <span className="text-[9px] font-semibold">{c.pct}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function ScreenshotsSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            See it in{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              action
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse of the beautiful, powerful dashboard waiting for you.
          </p>
        </motion.div>

        {/* Screenshot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {screenshots.map((screen, index) => {
            const Icon = screen.icon;
            return (
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="p-4 pb-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${screen.gradient}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{screen.title}</h3>
                      <p className="text-[10px] text-muted-foreground">{screen.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="min-h-[220px]">
                  {screen.content}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
