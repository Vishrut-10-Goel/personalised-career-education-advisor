import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// Environment validation
// ─────────────────────────────────────────────
const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

// ─────────────────────────────────────────────
// Server-side client (service role — full access)
// Use ONLY in API routes, never in client components.
// ─────────────────────────────────────────────
let serverClient: SupabaseClient | null = null;

export const getServerSupabase = (): SupabaseClient => {
    if (!serverClient) {
        serverClient = createClient(
            getEnv("NEXT_PUBLIC_SUPABASE_URL"),
            getEnv("SUPABASE_SERVICE_ROLE_KEY"),
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }
    return serverClient;
};

// ─────────────────────────────────────────────
// Public anon client (safe for browser / SSR)
// ─────────────────────────────────────────────
let anonClient: SupabaseClient | null = null;

export const getAnonSupabase = (): SupabaseClient => {
    if (!anonClient) {
        anonClient = createClient(
            getEnv("NEXT_PUBLIC_SUPABASE_URL"),
            getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        );
    }
    return anonClient;
};

// ─────────────────────────────────────────────
// Table name constants (avoids magic strings)
// ─────────────────────────────────────────────
export const TABLES = {
    USERS: "user_profiles",
    ROADMAPS: "roadmaps",
    PROGRESS: "user_progress",
    CHAT_SESSIONS: "chat_sessions",
} as const;
