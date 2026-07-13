# FinanceAI — Smart Expense Tracker

A modern, production-ready expense tracker built with Next.js 15, Supabase, Prisma, and shadcn/ui. Features an Apple-inspired minimal design with dark mode support.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square)

## Features

- 📊 **Dashboard** — Real-time financial overview with stat cards and charts
- 💰 **Expense Tracking** — Full CRUD operations with 10 categories
- 📈 **Analytics** — Pie charts, bar charts, and category rankings
- 🔍 **Search & Filter** — By date range, category, and text search
- 📱 **Responsive** — Mobile-first design with adaptive layout
- 🌙 **Dark Mode** — System-aware theme with manual toggle
- 🔐 **Authentication** — Secure email login via Supabase Auth
- 💱 **Currency** — IDR (Indonesian Rupiah) formatting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Authentication |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project

### 1. Clone & Install

```bash
git clone <repo-url>
cd financeai
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

```bash
npx vercel
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # Dashboard, Expenses, Analytics, Settings
│   ├── api/             # REST API routes
│   └── layout.tsx       # Root layout with providers
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   ├── expenses/        # Expense CRUD components
│   ├── layout/          # Sidebar, Topbar, Mobile nav
│   └── providers/       # Theme provider
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, Prisma client, Supabase clients
└── types/               # TypeScript type definitions
```

## License

MIT
