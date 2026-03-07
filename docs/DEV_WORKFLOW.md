# Development Workflow

## Setup
1. **Clone**: `git clone https://github.com/Vishrut-10-Goel/personalised-career-education-advisor.git`
2. **Install Dependencies**: `pnpm install`
3. **Environment**: Copy `.env.example` to `.env.local` and fill in your Gemini API key and Supabase credentials.
4. **Run**: `pnpm dev` (Runs on http://localhost:3000)

## Kill / Restart Server
```powershell
# Kill all Node.js processes
taskkill /F /IM node.exe

# Start fresh
pnpm dev
```

## Feature Development Flow
1. **Research**: Read `docs/AI_CONTEXT.md` and `docs/ARCHITECTURE.md` first.
2. **Design**: Update `docs/DB_SCHEMA.md` or `docs/API_CONTRACTS.md` if schema/API changes are needed.
3. **Implementation**:
    - Build UI in `/app` and `/components`.
    - Implement business logic in `/lib`.
    - Create API routes in `/app/api`.
4. **Verification**:
    - Test AI generation flows (Chatbot / Recommendations / Roadmaps).
    - Verify persistence in Supabase.
5. **Context Sync**: Update `docs/AI_CONTEXT.md` with new feature/task status.

## Coding Standards
- **TypeScript**: Mandatory for all new files. Use interfaces from `@/types`.
- **Modularity**: Keep components small; pull complex logic into `/lib`.
- **AI Hygiene**: Always call `generateGemini()` from `lib/gemini.ts` for any LLM interaction.
- **Styling**: Use the established dark mode (neon green `#c6ff00`, black `#080808`, uppercase bold typography).
- **No Fake Data**: Do not add placeholder or fallback AI responses. Surface real errors.

## Environment Variables Required
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `GEMINI_API_KEY` | Google Gemini API key (server-only) |
| `NEXT_PUBLIC_APP_URL` | Base URL (http://localhost:3000 for dev) |

> ⚠️ Never commit `.env.local`. It is protected by `.gitignore`.

## Git Workflow
```bash
git add -A
git commit -m "feat: description of change"
git push origin main
```
