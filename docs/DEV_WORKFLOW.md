# Development Workflow

## Setup
1. **Dependencies**: `pnpm install`
2. **Environment**: Copy `.env.example` to `.env.local` and add Gemini/Supabase keys.
3. **Run**: `pnpm dev` (Runs on http://localhost:3000).

## Feature Development Flow
1. **Research**: Read `docs/AI_CONTEXT.md` and `docs/ARCHITECTURE.md`.
2. **Design**: Update `docs/DB_SCHEMA.md` or `docs/API_CONTRACTS.md` if schema/API changes are needed.
3. **Implementation**:
    - Build UI in `/app` and `/components`.
    - Implement business logic in `/lib`.
    - Create API routes in `/app/api`.
4. **Verification**: 
    - Test AI generation flows (Recommendations/Roadmaps).
    - Verify persistence in Supabase.
5. **Context Sync**: Update `docs/AI_CONTEXT.md` with the new feature/task status.

## Coding Standards
- **TypeScript**: Mandatory for all new files. Use interfaces from `@/types`.
- **Modularity**: Keep components small; pull complex logic into `/lib`.
- **AI Hygiene**: Always use the `generateGemini` fallback wrapper for LLM calls.
- **Styling**: Use the established dark theme tokens (purple/blue gradients, white/5 glass backgrounds).
