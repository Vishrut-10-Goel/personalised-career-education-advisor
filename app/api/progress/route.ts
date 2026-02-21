import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type { Roadmap, UserProgress } from "@/types/roadmap";
import type { ApiResponse } from "@/types/user";

/**
 * GET: Fetch progress for a specific user and roadmap
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        const roadmap_id = searchParams.get("roadmap_id");

        if (!user_id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "user_id is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();

        // 1. If roadmap_id is provided, fetch specific progress
        if (roadmap_id) {
            const { data: progress, error } = await supabase
                .from(TABLES.PROGRESS)
                .select("*")
                .eq("user_id", user_id)
                .eq("roadmap_id", roadmap_id)
                .maybeSingle();

            if (error) throw error;

            if (!progress) {
                return NextResponse.json<ApiResponse<{ completed_topic_ids: string[]; overall_progress_percent: number }>>({
                    success: true,
                    data: {
                        completed_topic_ids: [],
                        overall_progress_percent: 0,
                    },
                });
            }

            return NextResponse.json<ApiResponse<UserProgress>>({
                success: true,
                data: progress as UserProgress,
            });
        }

        // 2. Otherwise, fetch all progress rows for the user
        const { data: allProgress, error: allProgressError } = await supabase
            .from(TABLES.PROGRESS)
            .select("*")
            .eq("user_id", user_id);

        if (allProgressError) throw allProgressError;

        return NextResponse.json<ApiResponse<UserProgress[]>>({
            success: true,
            data: allProgress as UserProgress[],
        });
    } catch (error) {
        console.error("[/api/progress] GET Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}

/**
 * POST: Update progress (mark topic as complete)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, roadmap_id, topic_id } = body;

        if (!user_id || !roadmap_id || !topic_id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "user_id, roadmap_id, and topic_id are required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();

        // 1. Fetch the roadmap to count total topics
        const { data: roadmap, error: roadmapError } = await supabase
            .from(TABLES.ROADMAPS)
            .select("*")
            .eq("id", roadmap_id)
            .single();

        if (roadmapError || !roadmap) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Roadmap not found." },
                { status: 404 }
            );
        }

        const typedRoadmap = roadmap as Roadmap;
        let totalTopics = 0;

        // Handle array-based sections
        if (Array.isArray(typedRoadmap.sections)) {
            typedRoadmap.sections.forEach((section) => {
                totalTopics += (section.topics || []).length;
            });
        }

        if (totalTopics === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "Roadmap has no topics." },
                { status: 400 }
            );
        }

        // 2. Fetch existing progress
        const { data: existingProgress, error: progressError } = await supabase
            .from(TABLES.PROGRESS)
            .select("*")
            .eq("user_id", user_id)
            .eq("roadmap_id", roadmap_id)
            .maybeSingle();

        if (progressError) throw progressError;

        let completedIds: string[] = existingProgress?.completed_topic_ids || [];

        // 3. Update completed list
        if (!completedIds.includes(topic_id)) {
            completedIds.push(topic_id);
        } else {
            // Already complete, return existing row
            return NextResponse.json<ApiResponse<UserProgress>>({
                success: true,
                data: existingProgress as UserProgress,
            });
        }

        const progressPercent = Math.floor((completedIds.length / totalTopics) * 100);

        // Determine current section (simple logic: divide percent by 33 for 3 levels)
        let current_section = "Beginner";
        if (progressPercent >= 66) current_section = "Advanced";
        else if (progressPercent >= 33) current_section = "Intermediate";

        // 4. Upsert progress row
        const now = new Date().toISOString();
        const progressUpdate = {
            user_id,
            roadmap_id,
            career: typedRoadmap.career,
            completed_topic_ids: completedIds,
            current_section: current_section,
            overall_progress_percent: progressPercent,
            last_activity_at: now,
            updated_at: now,
        };

        let result;
        if (existingProgress) {
            const { data, error: updateError } = await supabase
                .from(TABLES.PROGRESS)
                .update(progressUpdate)
                .eq("id", existingProgress.id)
                .select()
                .single();
            if (updateError) throw updateError;
            result = data;
        } else {
            const { data, error: insertError } = await supabase
                .from(TABLES.PROGRESS)
                .insert({
                    ...progressUpdate,
                    created_at: now,
                })
                .select()
                .single();
            if (insertError) throw insertError;
            result = data;
        }

        return NextResponse.json<ApiResponse<UserProgress>>({
            success: true,
            data: result as UserProgress,
        });
    } catch (error) {
        console.error("[/api/progress] POST Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
