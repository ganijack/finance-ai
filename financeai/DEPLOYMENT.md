# FinanceAI Deployment Guide

## Prerequisites
- Supabase account (for PostgreSQL database and Authentication)
- Node.js 18+ (for local builds)
- A deployment platform (Vercel, Railway, Docker, etc.)

## 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to **Authentication > Providers** and enable Email provider.
3. (Optional) Enable "Confirm Email" if you want users to verify their emails.
4. Retrieve your connection string from **Database > Settings**.
5. Retrieve your Anon Key and URL from **Settings > API**.

## 2. Environment Variables
You must set the following environment variables in your deployment environment:
```env
DATABASE_URL="postgres://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."
```

## 3. Deploying to Vercel (Recommended)
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Vercel will automatically detect Next.js.
4. Add the Environment Variables.
5. In the "Build Command" field, enter `npx prisma db push && npx prisma generate && next build`.
6. Deploy!

## 4. Deploying to Railway (Using Docker)
1. Push your code to GitHub.
2. Create a new Railway project and link your GitHub repo.
3. Railway will automatically detect the `Dockerfile` and `railway.json`.
4. Add the Environment Variables.
5. Deploy!

## 5. Deploying via Docker
You can run FinanceAI using Docker on any VPS:
```bash
docker build -t financeai .
docker run -p 3000:3000 --env-file .env.local financeai
```
