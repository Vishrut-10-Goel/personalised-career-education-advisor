import { NextRequest, NextResponse } from "next/server";
import { claudeJSON } from "@/lib/claude";
import { buildRoadmapPrompt } from "@/lib/prompts";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type { RoadmapRequestPayload, RoadmapResponse, Roadmap } from "@/types/roadmap";
import type { ApiResponse } from "@/types/user";

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

        // ── Generate with Claude ─────────────────────────────────
        const prompt = buildRoadmapPrompt({
            career: body.career,
            domain: body.domain,
            current_level: body.current_level ?? "beginner",
        });

        const generated = await claudeJSON<Omit<Roadmap, "id" | "created_at">>(prompt);

        // ── Persist to Supabase ──────────────────────────────────
        const { data: saved, error: saveError } = await supabase
            .from(TABLES.ROADMAPS)
            .insert({
                ...generated,
                career: body.career.toLowerCase(),
                domain: body.domain.toLowerCase(),
            })
            .select()
            .single();

        if (saveError) {
            console.warn("[/api/roadmap] Failed to cache roadmap:", saveError.message);
        }

        const roadmap = (saved ?? generated) as Roadmap;

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
