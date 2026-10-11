"use client";

import { X, Check } from "lucide-react";

const traditional = [
  "Pencatatan transaksi manual di buku/spreadsheet",
  "Admin harus standby membalas pesan WhatsApp satu per satu",
  "Sulit melacak pesanan yang sudah atau belum dibayar",
  "Rekap keuangan memakan waktu berjam-jam setiap malam",
];

const financeai = [
  "Transaksi tercatat otomatis langsung dari bot WhatsApp",
  "Katalog produk dan link pembayaran QRIS dikirim otomatis 24 jam",
  "Deteksi pembayaran otomatis tanpa perlu cek mutasi manual",
  "Laporan arus kas dan penjualan harian tersusun secara otomatis",
];

export function ComparisonSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Perbandingan Cara Kerja
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Lihat bagaimana FinanceAI menghemat waktu operasional dan pembukuan bisnis Anda.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <X className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Cara Manual Biasa</h3>
                  <p className="text-xs text-muted-foreground">Repot &amp; rentan salah catat</p>
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
            </div>
          </div>

          {/* FinanceAI */}
          <div className="relative rounded-2xl border-2 border-blue-600/40 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-md">
            {/* Solusi badge */}
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-xs">
                Otomatisasi Penuh
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Dengan FinanceAI</h3>
                  <p className="text-xs text-muted-foreground">Praktis, cepat &amp; rapi</p>
                </div>
              </div>
              <div className="space-y-3.5">
                {financeai.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
