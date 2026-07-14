# FinanceAI Architecture

## Overview
FinanceAI is a modern Next.js 14/15 application using the App Router. It follows a modular, server-first approach for data fetching and mutations, while leveraging client components for rich interactivity.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth (SSR via `@supabase/ssr`)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI Integration**: Google Gemini SDK (`@google/genai`)

## Directory Structure
- `/src/app`: Next.js App Router pages and API routes.
  - `(auth)`: Public authentication routes.
  - `(dashboard)`: Protected routes requiring user login.
  - `admin`: Protected routes requiring ADMIN role.
  - `api`: Next.js API route handlers.
- `/src/components`: Reusable UI components.
  - `ui`: Primitive components (buttons, inputs) from shadcn.
  - `layout`: Layout wrappers (Sidebar, Topbar).
  - `shared`: Global components (Logo, Error boundaries).
  - `*`: Feature-specific components (e.g., `expenses`, `analytics`).
- `/src/lib`: Core libraries and utilities.
  - `prisma.ts`: Global Prisma Client instance.
  - `supabase`: SSR Client and Server factories.
- `/src/services`: External API integrations (e.g., Gemini AI).
- `/src/hooks`: Custom React hooks (e.g., `useUser`, `useMediaQuery`).
- `/src/types`: Global TypeScript definitions.

## Authentication Flow
We use `@supabase/ssr` to securely manage authentication using cookies. The `middleware.ts` intercepts requests to ensure unauthenticated users are redirected from protected routes. The `createClient` utility in `src/lib/supabase` is used across Server Components, API routes, and Client Components to fetch the user session securely.
