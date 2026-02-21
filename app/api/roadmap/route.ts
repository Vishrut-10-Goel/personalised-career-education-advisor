import { NextRequest, NextResponse } from "next/server";
import { callOllamaJSON } from "@/lib/ollama";
import { buildRoadmapPrompt } from "@/lib/prompts";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type { RoadmapRequestPayload, RoadmapResponse, Roadmap } from "@/types/roadmap";
import type { ApiResponse } from "@/types/user";

/**
 * GET /api/roadmap?id=<roadmap_id>
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const user_id = searchParams.get("user_id");

        const supabase = getServerSupabase();

        if (id) {
            const { data, error } = await supabase
                .from(TABLES.ROADMAPS)
                .select("*")
                .eq("id", id)
                .maybeSingle();

            if (error) throw error;
            if (!data) {
                return NextResponse.json<ApiResponse>({ success: false, error: "Roadmap not found." }, { status: 404 });
            }

            return NextResponse.json<ApiResponse<{ roadmap: Roadmap }>>({
                success: true,
                data: { roadmap: data as Roadmap },
            });
        }

        if (user_id) {
            // Fetch latest roadmap the user has progress on
            const { data: progress, error: progressError } = await supabase
                .from(TABLES.PROGRESS)
                .select("roadmap_id")
                .eq("user_id", user_id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (progressError) throw progressError;

            if (progress?.roadmap_id) {
                const { data: roadmap, error: roadmapError } = await supabase
                    .from(TABLES.ROADMAPS)
                    .select("*")
                    .eq("id", progress.roadmap_id)
                    .maybeSingle();

                if (roadmapError) throw roadmapError;
                if (roadmap) {
                    return NextResponse.json<ApiResponse<{ roadmap: Roadmap }>>({
                        success: true,
                        data: { roadmap: roadmap as Roadmap },
                    });
                }
            }

            // Fallback: Check if there's any roadmap matching user's domain
            const { data: user } = await supabase.from(TABLES.USERS).select("domain").eq("id", user_id).maybeSingle();
            if (user?.domain) {
                const { data: domainRoadmap } = await supabase
                    .from(TABLES.ROADMAPS)
                    .select("*")
                    .eq("domain", user.domain.toLowerCase())
                    .limit(1)
                    .maybeSingle();

                if (domainRoadmap) {
                    return NextResponse.json<ApiResponse<{ roadmap: Roadmap }>>({
                        success: true,
                        data: { roadmap: domainRoadmap as Roadmap },
                    });
                }
            }
        }

        return NextResponse.json<ApiResponse>(
            { success: false, error: "Query parameter 'id' or 'user_id' is required." },
            { status: 400 }
        );
    } catch (error) {
        console.error("[GET /api/roadmap] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: RoadmapRequestPayload = await req.json();

        // ── Validation ──────────────────────────────────────────
        if (!body.career?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "career is required." },
                { status: 400 }
            );
        }
        if (!body.domain?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "domain is required." },
                { status: 400 }
            );
        }

        const supabase = getServerSupabase();

        // ── Check cache in Supabase first ────────────────────────
        const { data: cached } = await supabase
            .from(TABLES.ROADMAPS)
            .select("*")
            .eq("career", body.career.toLowerCase())
            .eq("domain", body.domain.toLowerCase())
            .maybeSingle();

        if (cached) {
            return NextResponse.json<ApiResponse<RoadmapResponse>>({
                success: true,
                data: { roadmap: cached as Roadmap },
                message: "Loaded from cache.",
            });
        }

        // ── Generate with Ollama ─────────────────────────────────
        const prompt = buildRoadmapPrompt({
            career: body.career,
            domain: body.domain,
            current_level: body.current_level ?? "beginner",
        });

        const generated = await callOllamaJSON<any>(prompt);

        // Sanitize sections: ensure it's an array
        const sections = Array.isArray(generated.sections)
            ? generated.sections
            : [];

        const roadmapData = {
            career: body.career.toLowerCase(),
            domain: body.domain.toLowerCase(),
            overview: generated.overview || "Professional career roadmap.",
            total_estimated_weeks: generated.total_estimated_weeks || 24,
            sections: sections,
        };

        // ── Persist to Supabase ──────────────────────────────────
        const { data: saved, error: saveError } = await supabase
            .from(TABLES.ROADMAPS)
            .insert(roadmapData)
            .select()
            .single();

        if (saveError) {
            console.warn("[/api/roadmap] Failed to cache roadmap:", saveError.message);
        }

        const roadmap = (saved ?? roadmapData) as Roadmap;

        return NextResponse.json<ApiResponse<RoadmapResponse>>({
            success: true,
            data: { roadmap },
        });
    } catch (error) {
        console.error("[/api/roadmap] Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
