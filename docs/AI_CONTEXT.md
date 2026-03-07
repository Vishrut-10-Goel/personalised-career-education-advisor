# AI Project Context

## Project Overview
Personalized Career Education Advisor — An AI-driven platform that helps users discover career paths, generates detailed learning roadmaps, and tracks progress towards career goals.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React (Icons).
- **Backend**: Next.js API Routes.
- **Database**: Supabase (PostgreSQL).
- **Auth**: Manual password storage in `user_profiles` (Transitioning to Supabase Auth).
- **AI/ML**: 
  - **Gemini (v1beta)**: Primary engine for Recommendations and Roadmaps.
  - **Ollama**: Currently powering the Chatbot (Local execution).
- **Infrastructure**: Local development (Next.js server), Supabase Cloud.

## Architecture Summary
The application follows a linear progression:
1. **Onboarding**: User provides skills, interests, and domain.
2. **Recommendations**: Gemini generates tailored career paths based on user profile.
3. **Roadmap**: AI builds a specific learning journey for a chosen career.
4. **Dashboard**: Central hub for tracking active learning, metrics, and quick access to tools.

## Core Features
- **AI-Generated Recommendations**: Dynamically generated career paths with job outlook and salary data.
- **AI-Driven Roadmaps**: Step-by-step learning modules with integrated YouTube/Course learning resources.
- **Skill Gap Analyzer**: Deep analysis comparing user profile DNA against targeted career requirements with a readiness score.
- **CareerVibe Chatbot**: Context-aware AI mentoring integrated with active roadmap data.
- **Social Sharing**: One-click sharing of career progress and mastery metrics.

## Current Status
- Career recommendations and roadmap generation are fully functional with Gemini integration.
- **Skill Gap Analyzer** is live, providing personalized readiness scores.
- **Resource Ingestion** is active, providing real learning links for every topic.
- Persistence is implemented: Roadmaps and progress are linked via Supabase.

## Current Task
- Finalizing UI unification and ensuring all AI prompts include mandated resource fields.

## Constraints
- **Styling**: Adhere to the "CareerVibe" aesthetic — dark mode (#080808 background), neon green (#c6ff00) accents, and bold/black typography (NO ITALICS).
- **API Flow**: Use the fallback chain in `lib/gemini.ts`.
- **Data Standards**: All names and career titles must be formatted using `toTitleCase`.

## Next Planned Features
- Stripe/Payment integration for premium tiers.
- Resume/Portfolio generator from mastered skills.
- Migration of Chatbot from Ollama to Gemini.

## Notes for AI Agents
- Always read `docs/AI_CONTEXT.md` before editing.
- Ensure `toTitleCase` utility is used for all user-facing names and titles.
- Roadmap generation prompt MUST include a `resources` array for every topic.
