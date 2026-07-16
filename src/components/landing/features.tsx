"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Zap,
  MessageSquareText,
  ScanLine,
  Brain,
  BarChart3,
  Shield,
} from "lucide-react";
import ShinyText from "@/components/ShinyText";

const features = [
  {
    icon: Zap,
    title: "Smart Expense Tracking",
    description: "Record expenses in seconds with an intuitive interface designed for speed.",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/25",
    spotlightColor: "rgba(251,191,36,0.08)",
  },
  {
    icon: MessageSquareText,
    title: "Natural Language Input",
    description: 'Simply type: "I bought coffee for 25k." AI understands automatically.',
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/25",
    spotlightColor: "rgba(99,102,241,0.08)",
  },
  {
    icon: ScanLine,
    title: "Receipt Scanner",
    description: "Upload receipts and let AI extract every expense detail instantly.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/25",
    spotlightColor: "rgba(16,185,129,0.08)",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Receive spending analysis and personalized recommendations powered by AI.",
    gradient: "from-purple-500 to-pink-600",
    glow: "shadow-purple-500/25",
    spotlightColor: "rgba(168,85,247,0.08)",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize your spending with beautiful, interactive charts and trends.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/25",
    spotlightColor: "rgba(6,182,212,0.08)",
  },
  {
    icon: Shield,
    title: "Secure Cloud Sync",
    description: "Your data is safely stored with enterprise-grade encryption, accessible anywhere.",
    gradient: "from-rose-500 to-red-600",
    glow: "shadow-rose-500/25",
    spotlightColor: "rgba(244,63,94,0.08)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function SpotlightCard({
  feature,
}: {
  feature: (typeof features)[0];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const spotY = useSpring(mouseY, { stiffness: 200, damping: 30 });
  const opacity = useMotionValue(0);
  const spotOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  const background = useTransform(
    [spotX, spotY],
    ([x, y]: number[]) =>
      `radial-gradient(300px circle at ${x}px ${y}px, ${feature.spotlightColor}, transparent 80%)`
  );

  const Icon = feature.icon;
  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-hidden cursor-default"
      onMouseMove={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        opacity.set(1);
      }}
      onMouseLeave={() => opacity.set(0)}
      whileHover={{ y: -4, borderColor: "hsl(var(--border))" }}
      transition={{ duration: 0.2 }}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-0"
        style={{ background, opacity: spotOpacity }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.glow} mb-4`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
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
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <ShinyText
              text="manage money"
              speed={4}
              shineColor="#a78bfa"
              color="#818cf8"
              spread={100}
              className="text-3xl sm:text-4xl font-bold"
            />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI-driven tools that make expense tracking effortless and insightful.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <SpotlightCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
