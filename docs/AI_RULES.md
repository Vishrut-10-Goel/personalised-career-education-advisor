# AI Agent Rules

## General Constraints
- **Use `generateGemini()` for ALL AI calls**: This is the only approved AI call in the codebase. It handles model fallback automatically via `lib/gemini.ts`.
- **No Fallback Dummy Data**: Remove any hardcoded or generated fake responses. If AI fails, surface the error to the user.
- **No Ollama**: The Ollama integration has been deprecated. Do not re-add it.
- **Preserve Dashboard Metrics**: Any changes to `roadmaps` or `user_progress` must stay compatible with `lib/gamification.ts`.
- **Database Modesty**: Do not delete existing columns or tables without explicit confirmation. Always favor `upsert` for profile and progress updates.
- **Consistent UI**: Maintain the "CareerVibe" aesthetic: `#080808` dark bg, `#c6ff00` neon green accents, bold/uppercase typography.

## Memory Management
- **Read First**: Always read `docs/AI_CONTEXT.md` at the start of a session.
- **Self-Document**: If you change the API, schema, or AI models, you **MUST** update the corresponding file in `/docs`.
- **Token Efficiency**: Use provided documentation instead of re-reading 100+ lines of codebase repeatedly.

## API Rules
- All responses must follow the `ApiResponse<T>` interface from `@/types/user.ts`.
- Handle 429 (rate limit) and 401 (auth) errors gracefully with descriptive error messages.
- Never add fallback mechanisms that return fake or templated AI responses.

## Security Rules
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in any frontend (`'use client'`) file.
- Use `getServerSupabase()` **only** in server-side API routes.
- `.env.local` must **never** be committed to Git. It is protected by `.gitignore`.

## Model Selection Rules
- Use only lightweight Flash models to preserve free-tier Gemini quota:
  - ✅ `gemini-flash-lite-latest`, `gemini-1.5-flash-8b`, `gemini-flash-latest`, `gemini-1.5-flash`
  - ❌ `gemini-2.5-pro`, `gemini-1.5-pro`, or any other Pro-tier model
- Do not change model order without documenting the reason.
