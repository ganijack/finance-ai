"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const traditional = [
  "Manual input for every transaction",
  "Hard to analyze spending patterns",
  "Basic statistics and summaries",
  "No intelligent recommendations",
];

const financeai = [
  "AI understands natural language",
  "Automatic receipt scanning",
  "Smart insights & recommendations",
  "Beautiful interactive analytics",
];

export function ComparisonSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            Why FinanceAI
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Not your average{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              expense tracker
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how FinanceAI compares to traditional expense trackers.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Traditional Tracker</h3>
                <p className="text-xs text-muted-foreground">The old way</p>
              </div>
            </div>
            <div className="space-y-3.5">
              {traditional.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 mt-0.5">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FinanceAI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.05] to-purple-500/[0.05] backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-indigo-500/5"
          >
            {/* Recommended badge */}
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                Recommended
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold">FinanceAI</h3>
                <p className="text-xs text-muted-foreground">The smart way</p>
              </div>
            </div>
            <div className="space-y-3.5">
              {financeai.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
