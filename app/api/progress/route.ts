import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type { UpdateProgressPayload, UserProgress, ProgressSummary } from "@/types/roadmap";
import type { ApiResponse } from "@/types/user";

// ─────────────────────────────────────────────
// GET /api/progress?user_id=<id>&roadmap_id=<id>
// Returns progress summary for a specific roadmap
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        const roadmap_id = searchParams.get("roadmap_id");

        if (!user_id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Query parameter 'user_id' is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();

        // Build query — optionally filter by roadmap
        const query = supabase
            .from(TABLES.PROGRESS)
            .select("*")
            .eq("user_id", user_id)
            .order("updated_at", { ascending: false });

        if (roadmap_id) {
            query.eq("roadmap_id", roadmap_id);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "No progress records found." },
                { status: 404 }
            );
        }

        // Map to ProgressSummary shape
        const summaries: ProgressSummary[] = (data as UserProgress[]).map((p) => ({
            roadmap_id: p.roadmap_id,
            career: p.career,
            total_topics: p.completed_topic_ids.length, // approximation pre-roadmap fetch
            completed_topics: p.completed_topic_ids.length,
            overall_progress_percent: p.overall_progress_percent,
            current_section: p.current_section,
            estimated_weeks_remaining: Math.max(
                0,
                Math.ceil(((100 - p.overall_progress_percent) / 100) * 52)
            ),
            last_activity_at: p.last_activity_at,
        }));

        return NextResponse.json<ApiResponse<ProgressSummary[]>>({
            success: true,
            data: roadmap_id ? [summaries[0]] : summaries,
        });
    } catch (error) {
        console.error("[GET /api/progress] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}

// ─────────────────────────────────────────────
// POST /api/progress  — mark a topic as complete
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body: UpdateProgressPayload = await req.json();

        if (!body.user_id || !body.roadmap_id || !body.completed_topic_id) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    error: "user_id, roadmap_id, and completed_topic_id are required.",
                },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();

        // Fetch existing progress record
        const { data: existing, error: fetchError } = await supabase
            .from(TABLES.PROGRESS)
            .select("*")
            .eq("user_id", body.user_id)
            .eq("roadmap_id", body.roadmap_id)
            .maybeSingle();

        if (fetchError) throw fetchError;

        const now = new Date().toISOString();

        if (!existing) {
            // Create new progress record
            const { data: created, error: createError } = await supabase
                .from(TABLES.PROGRESS)
                .insert({
                    user_id: body.user_id,
                    roadmap_id: body.roadmap_id,
                    career: body.career,
                    completed_topic_ids: [body.completed_topic_id],
                    current_section: "beginner",
                    overall_progress_percent: 0,
                    last_activity_at: now,
                })
                .select()
                .single();

            if (createError) throw createError;

            return NextResponse.json<ApiResponse<UserProgress>>(
                { success: true, data: created as UserProgress, message: "Progress record created." },
                { status: 201 }
            );
        }

        // Deduplicate completed topics
        const completedSet = new Set<string>(existing.completed_topic_ids ?? []);
        completedSet.add(body.completed_topic_id);
        const completed_topic_ids = Array.from(completedSet);

        // Determine current section based on rough progress thresholds
        const percent = existing.overall_progress_percent ?? 0;
        const current_section =
            percent >= 66 ? "advanced" : percent >= 33 ? "intermediate" : "beginner";

        const { data: updated, error: updateError } = await supabase
            .from(TABLES.PROGRESS)
            .update({
                completed_topic_ids,
                current_section,
                last_activity_at: now,
                updated_at: now,
            })
            .eq("id", existing.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json<ApiResponse<UserProgress>>({
            success: true,
            data: updated as UserProgress,
            message: "Progress updated.",
        });
    } catch (error) {
        console.error("[POST /api/progress] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
