import { NextRequest, NextResponse } from "next/server";
import { callOllamaJSON } from "@/lib/ollama";
import { buildRecommendPrompt } from "@/lib/prompts";
import type { RecommendRequestPayload, RecommendResponse } from "@/types/career";
import type { ApiResponse } from "@/types/user";

export async function POST(req: NextRequest) {
    try {
        const body: RecommendRequestPayload = await req.json();

        // ── Validation ──────────────────────────────────────────
        if (!body.skills || !Array.isArray(body.skills)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "skills must be an array of strings." },
                { status: 400 }
            );
        }
        if (!body.domain) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "domain is required." },
                { status: 400 }
            );
        }

        // ── Build prompt & call Ollama ───────────────────────────
        const prompt = buildRecommendPrompt({
            skills: body.skills,
            interests: body.interests ?? [],
            education_level: body.education_level ?? "not specified",
            domain: body.domain,
        });

        const result = await callOllamaJSON<RecommendResponse>(prompt);

        return NextResponse.json<ApiResponse<RecommendResponse>>({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("[/api/recommend] Error:", error);
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
