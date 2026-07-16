"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";
import { Brain, Receipt, BarChart3, ScanLine, Sparkles, Send, Coffee } from "lucide-react";

export default function AIPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-indigo-500/30">
      <LandingNavbar />

      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-sm text-indigo-400 mb-6">
              <Sparkles className="h-4 w-4" />
              FinanceAI Engine
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI is designed to make expense tracking completely frictionless. 
              No more manual data entry. Just type or scan, and we handle the rest.
            </p>
          </motion.div>
        </div>

        {/* Feature 1: AI Input */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4">1. Type Naturally (AI Input)</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Forget filling out tedious forms. Just tell our AI what you spent your money on, using your own words. It understands context, amounts, and categories instantly.
              </p>
              <ul className="space-y-3">
                {[
                  "Understands Indonesian & English naturally",
                  "Automatically detects amount and category",
                  "Saves you 90% of data entry time"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* CSS Mockup for AI Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl -z-10 rounded-3xl" />
              
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-md">
                    <p className="text-sm">Makan siang di warteg tadi habis 35rb</p>
                  </div>
                </div>
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] border border-border shadow-sm">
                    <p className="text-sm font-medium text-foreground mb-1">Expense Added!</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border"><Coffee className="h-3 w-3 text-orange-400" /> Food & Drink</span>
                      <span className="font-mono text-foreground font-semibold">Rp 35.000</span>
                    </div>
                  </div>
                </div>
                {/* Input Field */}
                <div className="mt-8 flex items-center gap-2 bg-background border border-border rounded-full p-2 pl-4 shadow-inner">
                  <p className="text-sm text-muted-foreground flex-1">Type an expense...</p>
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                    <Send className="h-4 w-4 text-white ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature 2: Receipt Scanner */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* CSS Mockup for Receipt Scanner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl border border-border/50 bg-card p-6 shadow-2xl order-2 lg:order-1"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-2xl -z-10 rounded-3xl" />
              
              <div className="relative aspect-[3/4] bg-background rounded-xl border border-border overflow-hidden flex items-center justify-center group">
                {/* Simulated Receipt */}
                <div className="w-48 bg-white/5 p-4 rounded text-[10px] font-mono text-muted-foreground border-t-[10px] border-emerald-500/50 shadow-2xl">
                  <div className="text-center font-bold mb-4 text-foreground/80">Kopi Senja</div>
                  <div className="flex justify-between mb-1"><span>Iced Latte</span><span>35,000</span></div>
                  <div className="flex justify-between mb-1"><span>Pastry</span><span>25,000</span></div>
                  <div className="border-t border-dashed border-border my-2" />
                  <div className="flex justify-between font-bold text-foreground"><span>TOTAL</span><span>60,000</span></div>
                </div>
                {/* Scanning Overlay */}
                <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-6">
                <ScanLine className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4">2. Scan Receipts</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Got a physical receipt? Just snap a picture. Our intelligent scanner reads the merchant, items, date, and total amount with incredible accuracy.
              </p>
              <ul className="space-y-3">
                {[
                  "Works with crumpled or faded receipts",
                  "Extracts totals and tax automatically",
                  "Attaches the receipt image for your records"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Feature 3: Smart Dashboard */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4">3. Automated Dashboard</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Watch your data come to life. The AI organizes all your inputs into beautiful, easy-to-understand charts. It even gives you personalized insights to help you save.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time expense categorization",
                  "Predictive budget warnings",
                  "Actionable tips to reduce spending"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* CSS Mockup for Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl -z-10 rounded-3xl" />
              
              <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-xl font-bold">Rp 3.5M</p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">AI Prediction</p>
                    <p className="text-xl font-bold text-amber-500">Rp 4.2M</p>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="bg-background border border-border rounded-xl p-4 h-32 flex items-end gap-2 justify-between">
                  {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-indigo-500/50" style={{ height: `${h}%` }} />
                  ))}
                </div>
                
                {/* Insight */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Insight:</strong> Your transport spending is 15% higher this week. Consider taking the train to save Rp 200,000.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
