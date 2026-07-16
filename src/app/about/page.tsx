"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import ProfileCard from "@/components/ProfileCard";
import { ExternalLink, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/30">
      <LandingNavbar />
      
      <main className="flex-1 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Creator Profile - Sticky on Desktop */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col items-center mb-8 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
              >
                <ProfileCard
                  avatarUrl="/profile.png"
                  miniAvatarUrl="/profile.png"
                  name="Thoriq Abdillah F.K."
                  title="AI Engineer"
                  handle="ganijack"
                  status="Building FinanceAI 🚀"
                  contactText="LinkedIn"
                  enableTilt={true}
                  behindGlowEnabled={true}
                  behindGlowColor="rgba(99, 102, 241, 0.4)"
                  innerGradient="linear-gradient(145deg, #3730a380 0%, #7c3aed44 100%)"
                  onContactClick={() => {
                    window.open("https://www.linkedin.com/in/thoriq-abdillah-falian-kusuma-433615289/", "_blank");
                  }}
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3 mt-6"
              >
                <a
                  href="https://github.com/ganijack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/thoriq-abdillah-falian-kusuma-433615289/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </motion.div>
            </div>

            {/* Content Article */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  About FinanceAI
                </h1>
                <h2 className="text-2xl font-semibold text-indigo-400 mt-0 mb-8 border-b border-white/10 pb-4">
                  Smarter Personal Finance Starts Here
                </h2>
                
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    FinanceAI is an AI-powered personal finance platform designed to make expense tracking simple, intelligent, and effortless. Instead of manually filling out forms or categorizing every transaction yourself, FinanceAI lets artificial intelligence do the heavy lifting, so you can focus on understanding your finances rather than managing spreadsheets.
                  </p>
                  
                  <p>
                    Our mission is to help individuals build healthier financial habits through modern technology. Whether you're a student managing a monthly allowance, a freelancer tracking income, or someone simply trying to stay on top of daily expenses, FinanceAI provides a faster and more intuitive way to organize your financial life.
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-8">
                    <h3 className="text-xl font-medium text-white mb-3">The AI-First Approach</h3>
                    <p className="m-0 text-sm md:text-base">
                      What makes FinanceAI different is its AI-first approach. You can record transactions using natural language, such as <span className="text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded">"Bought coffee for $5"</span>, and the system automatically understands the amount, category, and transaction type before asking for confirmation. You can also upload receipts, allowing AI-powered OCR to extract transaction details without manual input.
                    </p>
                  </div>
                  
                  <p>
                    Beyond recording expenses, FinanceAI provides interactive analytics that transform financial data into meaningful insights. Visual reports help users understand spending patterns, monitor budgets, and make more informed financial decisions over time.
                  </p>
                  
                  <p>
                    The platform is built with a modern, scalable technology stack including <strong className="text-white">Next.js, TypeScript, Tailwind CSS, Prisma ORM, Supabase, and Google Gemini AI</strong>. Every component is designed with performance, responsiveness, and user experience in mind to deliver a smooth experience across desktop and mobile devices.
                  </p>
                  
                  <p>
                    FinanceAI is continuously evolving. Upcoming features include AI-powered budgeting recommendations, recurring transaction automation, financial goal tracking, subscription management, and personalized spending insights that adapt to each user's financial behavior.
                  </p>
                  
                  <div className="border-l-4 border-indigo-500 pl-4 py-1 mt-8 italic text-white/90">
                    FinanceAI isn't just another expense tracker—it's a smarter way to understand, manage, and improve your personal finances with the help of artificial intelligence.
                  </div>
                </div>
              </article>
            </motion.div>

          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
