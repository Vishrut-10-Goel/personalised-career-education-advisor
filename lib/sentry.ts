/**
 * Sentry Configuration for CareerAI
 * 
 * TO ACTIVATE:
 * 1. Create a free account at https://sentry.io
 * 2. Create a new Next.js project
 * 3. Add your DSN to .env.local:
 *    NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
 * 
 * This file is intentionally lightweight. Full Next.js integration 
 * would also require sentry.server.config.ts and sentry.edge.config.ts.
 */
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('[Sentry] DSN not set. Error tracking is disabled. Add NEXT_PUBLIC_SENTRY_DSN to .env.local to enable.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    // Capture 100% of transactions in dev, 10% in production
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
    // Replay 5% of sessions, 100% when error occurs
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}

/**
 * Capture an AI-specific error (Gemini quota, Ollama timeout, etc.)
 * Call this from API routes to track AI failures.
 */
export function captureAIError(error: Error, context: Record<string, any> = {}) {
  if (!SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'ai_generation');
    scope.setContext('ai_context', context);
    Sentry.captureException(error);
  });
}
