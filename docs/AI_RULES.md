# AI Agent Rules

## General Constraints
- **Do NOT break the AI Fallback Chain**: All production AI calls must use `generateGemini` in `lib/gemini.ts` to ensure reliability across models.
- **Preserve Dashboard Metrics**: Any changes to `roadmaps` or `user_progress` must be compatible with the logic in `lib/gamification.ts`.
- **Database Modesty**: Do not delete existing columns or tables without explicit confirmation. Always favor `upsert` for profile and progress updates.
- **Consistent UI**: Maintain the "Glassmorphism" aesthetic. Use `DashboardCard` for all dashboard-level widgets.

## Memory Management
- **Read First**: Always read `docs/AI_CONTEXT.md` at the start of a session.
- **Self-Document**: If you change the API or Schema, you **MUST** update the corresponding file in `/docs`.
- **Token Efficiency**: Use provided documentation instead of reading through 100+ lines of codebase repeatedly.

## API Rules
- All responses must follow the `ApiResponse<T>` interface from `@/types/user.ts`.
- Handle 429 and 401 errors gracefully with descriptive error messages in the `analysis_summary` or `error` field.

## Security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in frontend code.
- Use `getServerSupabase` only in server-side contexts (API routes).
