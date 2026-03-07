# System Architecture

## Overview
CareerVibe is a Next.js 15 (App Router) application powered entirely by the **Google Gemini API** for AI features and **Supabase** for data persistence.

## Folder Structure
- `/app` — Next.js App Router (Pages & API Routes)
  - `/api/chat` — Gemini-powered career chatbot
  - `/api/recommend` — AI career recommendation engine
  - `/api/roadmap` — AI roadmap generator + GET retrieval
  - `/api/user` — User profile CRUD (GET / POST / PATCH)
  - `/dashboard` — User's progress hub and feature pages
  - `/onboarding` — Multi-step profile setup wizard
  - `/signup` — Account creation (with crypto.randomUUID fallback)
  - `/login` — Password-based authentication
  - `/page.tsx` — Landing page (auth-aware, gates to signup)
- `/components` — Reusable UI components (DashboardCard, Sidebar, etc.)
- `/lib` — Core utilities
  - `gemini.ts` — Gemini API client with model fallback chain
  - `supabase.ts` — Supabase client (server + browser)
  - `prompts.ts` — Centralized AI prompt templates
- `/types` — TypeScript interfaces for consistent data handling
- `/docs` — Project documentation and AI context memory

## Data Flow
1. **Landing Page** → Unauthenticated → Sign Up / Sign In
2. **Onboarding** → User provides skills, interests, and domain across 5 steps
3. **POST /api/recommend** → Gemini generates career paths based on user profile
4. **POST /api/roadmap** → Gemini builds a custom learning journey for the chosen career
5. **GET /api/roadmap?user_id** → Dashboard retrieves the user's active roadmap
6. **POST /api/chat** → Gemini responds contextually with roadmap and career awareness

## AI Integration (Gemini)
All AI features use `generateGemini()` from `lib/gemini.ts`.

**Model Priority (Free Tier Optimized):**
```
gemini-flash-lite-latest  ← Primary (lowest token cost)
gemini-1.5-flash-8b       ← Secondary
gemini-flash-latest       ← Tertiary
gemini-1.5-flash          ← Fallback
```

**Error Handling:**
- No fallback dummy data — errors are surfaced directly to the user
- Rate limit (429) and auth (401) errors are returned as descriptive messages

## External Integrations
- **Google Generative AI**: Gemini API (v1beta) — All AI features
- **Supabase**: PostgreSQL database, JSONB storage for complex roadmap structures
- **Vercel**: Recommended deployment platform
