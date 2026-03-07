import { NextRequest, NextResponse } from "next/server";
import { generateGemini } from "@/lib/gemini";
import { buildRecommendPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rateLimiter";
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

        // ── Rate Limiting (10 recommendations per user per day) ──
        if (body.user_id) {
            const { allowed, remaining, resetInMs } = checkRateLimit(body.user_id, "recommendations", 10);
            if (!allowed) {
                const resetMins = Math.ceil(resetInMs / 60000);
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Daily AI recommendation limit reached. Resets in ${resetMins} minutes.` },
                    { status: 429, headers: { 'Retry-After': String(Math.ceil(resetInMs / 1000)) } }
                );
            }
        }

        // ── Build prompt & call Gemini ───────────────────────────
        const prompt = buildRecommendPrompt({
            skills: body.skills,
            interests: body.interests ?? [],
            education_level: body.education_level ?? "not specified",
            domain: body.domain,
        });

        console.log(`[/api/recommend] Requesting AI (Domain: ${body.domain})`);
        const startTime = Date.now();

        try {
            const text = await generateGemini(prompt);
            const raw = JSON.parse(text);
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);

            let recommendations: RecommendResponse["recommendations"] = [];

            // Helper to normalise a single career path
            const normalise = (r: any) => ({
                title: String(r.title || r.name || r.career || "Untitled"),
                description: String(r.description || r.desc || "No description available."),
                match_score: typeof r.match_score === "number" ? r.match_score : 85,
                required_skills: Array.isArray(r.required_skills) ? r.required_skills : [],
                domain: body.domain as any,
                avg_salary_usd: typeof r.avg_salary_usd === "number" ? r.avg_salary_usd : 0,
                job_outlook: (r.job_outlook === "growing" || r.job_outlook === "stable" || r.job_outlook === "declining" || r.job_outlook === "booming") ? r.job_outlook : "growing",
                time_to_entry_months: typeof r.time_to_entry_months === "number" ? r.time_to_entry_months : 12,
                learning_resources: Array.isArray(r.learning_resources) ? r.learning_resources : []
            });

            if (Array.isArray(raw)) {
                recommendations = raw.map(normalise);
            } else if (raw.recommendations && Array.isArray(raw.recommendations)) {
                recommendations = raw.recommendations.map(normalise);
            } else if (raw.title1 && raw.desc1) {
                recommendations = [
                    normalise({ title: raw.title1, description: raw.desc1 }),
                    normalise({ title: raw.title2, description: raw.desc2 }),
                    normalise({ title: raw.title3, description: raw.desc3 })
                ].filter(r => r.title !== "Untitled");
            } else {
                // Heuristic: find any array
                const picked = Object.values(raw).find(v => Array.isArray(v)) as any[];
                if (picked) {
                    recommendations = picked.map(normalise);
                } else {
                    throw new Error("UNEXPECTED_JSON_SHAPE");
                }
            }

            return NextResponse.json<ApiResponse<RecommendResponse>>({
                success: true,
                data: {
                    recommendations,
                    analysis_summary: `${raw.analysis_summary || raw.summary || "AI-generated recommendations."} (Generated in ${duration}s)`,
                },
            });

        } catch (innerError) {
            console.error("[/api/recommend] Gemini/Parsing Error:", innerError);
            throw innerError;
        }

    } catch (error) {
        console.error("[/api/recommend] AI Failed:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : "AI career advice engine is currently at capacity.",
            },
            { status: 500 }
        );
    }
}
