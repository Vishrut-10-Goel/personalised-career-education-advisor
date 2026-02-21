import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// Environment validation
// ─────────────────────────────────────────────
const getServerEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required server environment variable: ${key}`);
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
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            getServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
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
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            throw new Error(
                "Missing Supabase client environment variables. " +
                "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
            );
        }

        anonClient = createClient(url, key);
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
