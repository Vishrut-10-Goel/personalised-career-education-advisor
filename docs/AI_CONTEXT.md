# AI Project Context

## Project Overview
CareerVibe — Personalised Career Education Advisor — An AI-driven platform that helps users discover career paths, generates detailed learning roadmaps, and tracks progress towards career goals. All AI features are powered by the **Google Gemini API** (no local LLM required).

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Lucide React (Icons).
- **Backend**: Next.js API Routes.
- **Database**: Supabase (PostgreSQL + JSONB for roadmaps).
- **Auth**: Manual password storage in `user_profiles` (lightweight, no Supabase Auth).
- **AI/ML**:
  - **Gemini (v1beta)**: Powers ALL features — Chatbot, Career Recommendations, and Roadmap Generation.
  - **Ollama**: Removed / deprecated. No longer used.

## AI Model Priority (Free Tier Optimized)
The project uses a cost-efficient model fallback chain in `lib/gemini.ts`:
1. `gemini-flash-lite-latest` — lightest, lowest token cost (primary)
2. `gemini-1.5-flash-8b` — fast 8B model (secondary)
3. `gemini-flash-latest` — latest flash alias (tertiary)
4. `gemini-1.5-flash` — stable fallback

> ⚠️ Pro models (Gemini Pro, 2.5 Pro) are intentionally excluded to preserve free-tier quotas.

## Architecture Summary
The application follows a linear progression:
1. **Landing Page**: Unauthenticated visitors see "Sign In" / "Sign Up". CTA redirects to signup.
2. **Signup/Login**: Lightweight auth — password stored directly in `user_profiles`.
3. **Onboarding**: User provides skills, interests, and domain across 5 steps.
4. **Recommendations**: Gemini generates tailored career paths based on user profile.
5. **Roadmap**: AI builds a specific learning journey for a chosen career.
6. **Dashboard**: Central hub for tracking active learning, metrics, and quick access to tools.
7. **Chatbot**: Real-time AI career advice powered by Gemini.

## Core Features
- **AI-Generated Recommendations**: Dynamically generated career paths with job outlook and salary data.
- **AI-Driven Roadmaps**: Step-by-step learning modules with integrated YouTube/Course learning resources.
- **CareerVibe Chatbot**: Context-aware AI mentoring powered entirely by Gemini (no Ollama).
- **Landing Page Auth Gate**: Unauthenticated users are redirected to signup before accessing career tools.

## Current Status
- ✅ All AI features (Chatbot, Roadmap, Recommendations) are fully powered by Gemini
- ✅ Fallback mechanism removed — errors are surfaced directly to the user
- ✅ Model list optimized for free-tier API usage (lightweight models first)
- ✅ Landing page properly gates unauthenticated users to signup/login
- ✅ `crypto.randomUUID` fallback added for broad browser compatibility

## Constraints
- **Styling**: Adhere to the "CareerVibe" aesthetic — dark mode (`#080808` background), neon green (`#c6ff00`) accents, bold/black typography (NO ITALICS).
- **API Flow**: All AI calls must use `generateGemini()` in `lib/gemini.ts`.
- **Data Standards**: All names and career titles must be formatted using `toTitleCase`.
- **Security**: `GEMINI_API_KEY` and Supabase keys must never appear in frontend code or be committed to Git.

## Environment Variables
Never commit `.env.local`. Use `.env.example` as the template. Required keys:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`
