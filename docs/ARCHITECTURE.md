# System Architecture

## Overview
Career AI is a Next.js application that leverages generative AI to provide personalized career guidance. It uses Supabase for persistent storage and real-time state management.

## Folder Structure
- `/app`: Next.js App Router (Pages & API Routes).
  - `/api`: Backend endpoints for AI generation and DB operations.
  - `/recommendations`: UI for displaying AI career paths.
  - `/roadmap`: UI for displaying specific learning steps.
  - `/dashboard`: User's progress hub.
- `/components`: Reusable UI components (DashboardCard, Sidebar, etc.).
- `/lib`: Core utilities (AI clients, Supabase config, prompts).
- `/types`: TypeScript interfaces for consistent data handling.
- `/docs`: Project documentation and AI context memory.

## Data Flow
1. **User Input** → Collected via `onboarding` form.
2. **API Request** → Profile sent to `/api/recommend`.
3. **AI Generation** → Gemini processes data via `lib/gemini.ts`.
4. **Persistence** → AI results saved to `user_profiles` and `roadmaps`.
5. **Dashboard Render** → Fetches data from `user_progress` to show growth metrics.

## Key Modules
- **Gemini Client (`lib/gemini.ts`)**: Handles model switching, quota management, and JSON extraction.
- **Prompts Engine (`lib/prompts.ts`)**: Centralized templates for AI instructions.
- **Gamification Logic (`lib/gamification.ts`)**: Calculates progress % and milestones from roadmap data.

## External Integrations
- **Google Generative AI**: Gemini API (v1beta).
- **Supabase**: PostgreSQL database and JSONB storage for complex roadmap structures.
- **Ollama (Optional)**: Local LLM runner for chatbot features.
