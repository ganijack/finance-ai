"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
        >
          {/* Content */}
          <div className="relative text-center py-16 sm:py-20 px-6 sm:px-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6">
              <MessageSquareText className="h-6 w-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Mulai Kelola Bisnis Anda Lebih Rapi
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Bergabunglah dengan FinanceAI untuk mempermudah penerimaan pesanan pelanggan dan pembukuan keuangan harian bisnis Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 px-8 text-base shadow-sm">
                <Link href="/register">
                  Buat Akun Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/login">Masuk ke Akun</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
