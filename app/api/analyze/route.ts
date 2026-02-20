import { NextRequest, NextResponse } from "next/server";
import { claudeJSON } from "@/lib/claude";
import { buildAnalyzePrompt } from "@/lib/prompts";
import type { AnalyzeRequestPayload, AnalyzeResponse } from "@/types/career";
import type { ApiResponse } from "@/types/user";

const MAX_RESUME_LENGTH = 10_000; // characters

export async function POST(req: NextRequest) {
    try {
        const body: AnalyzeRequestPayload = await req.json();

        // ── Validation ──────────────────────────────────────────
        if (!body.resume_text?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "resume_text is required." },
                { status: 400 }
            );
        }
        if (!body.target_career?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "target_career is required." },
                { status: 400 }
            );
        }
        if (body.resume_text.length > MAX_RESUME_LENGTH) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    error: `resume_text exceeds maximum length of ${MAX_RESUME_LENGTH} characters.`,
                },
                { status: 400 }
            );
        }

        // ── Build prompt & call Claude ───────────────────────────
        const prompt = buildAnalyzePrompt({
            resume_text: body.resume_text.trim(),
            target_career: body.target_career.trim(),
            domain: body.domain,
        });

        const result = await claudeJSON<AnalyzeResponse>(prompt, {
            maxTokens: 3000,
        });

        return NextResponse.json<ApiResponse<AnalyzeResponse>>({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("[/api/analyze] Error:", error);
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
