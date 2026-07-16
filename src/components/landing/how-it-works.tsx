"use client";

import { motion } from "framer-motion";
import { UserPlus, Receipt, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds with just your email. No credit card required.",
    icon: UserPlus,
    gradient: "from-zinc-500 to-blue-600",
  },
  {
    step: "02",
    title: "Record Expenses",
    description: "Type naturally, scan receipts, or manually add expenses your way.",
    icon: Receipt,
    gradient: "from-zinc-500 to-zinc-600",
  },
  {
    step: "03",
    title: "AI Organizes Everything",
    description: "Our AI automatically categorizes, tags, and structures your data.",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    step: "04",
    title: "Understand Your Spending",
    description: "Get clear insights, trends, and recommendations to spend smarter.",
    icon: BarChart3,
    gradient: "from-amber-500 to-orange-600",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Get started in{" "}
            <span className="bg-gradient-to-r from-zinc-400 to-zinc-400 bg-clip-text text-transparent">
              4 simple steps
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From signup to smart insights — it takes less than 2 minutes.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[27px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-zinc-500/50 via-zinc-500/50 to-amber-500/50" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden flex items-start gap-5">
                    <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="pt-1">
                      <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                      <h3 className="text-lg font-semibold mt-0.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr,56px,1fr] items-center gap-4">
                    {/* Left content */}
                    <div className={`${isEven ? "text-right" : "order-3 text-left"}`}>
                      <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                      <h3 className="text-lg font-semibold mt-0.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                    </div>

                    {/* Center icon */}
                    <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${isEven ? "" : "order-2"}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Empty space */}
                    <div className={isEven ? "order-3" : ""} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
