import { NextRequest, NextResponse } from "next/server";
import { generateGemini } from "@/lib/gemini";
import { buildRoadmapPrompt } from "@/lib/prompts";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimiter";
import type { RoadmapRequestPayload, RoadmapResponse, Roadmap, RoadmapSection, RoadmapTopic } from "@/types/roadmap";
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
            // 1. Fetch latest roadmap the user has progress on
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

            // 2. Fallback: Check user's target_career from profile
            const { data: user } = await supabase
                .from(TABLES.USERS)
                .select("domain, target_career")
                .eq("id", user_id)
                .maybeSingle();

            if (user?.target_career) {
                const { data: targetRoadmap } = await supabase
                    .from(TABLES.ROADMAPS)
                    .select("*")
                    .eq("career", user.target_career.toLowerCase())
                    .eq("domain", user.domain?.toLowerCase() || "")
                    .maybeSingle();

                if (targetRoadmap) {
                    return NextResponse.json<ApiResponse<{ roadmap: Roadmap }>>({
                        success: true,
                        data: { roadmap: targetRoadmap as Roadmap },
                    });
                }
            }

            // 3. Last Fallback: Check if there's any roadmap matching user's domain
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

function normaliseSections(rawSections: any[]): RoadmapSection[] {
    return (rawSections || []).map((section, sectionIndex) => {
        const level: string = section?.level || section?.stage || "Beginner";

        const stage: RoadmapSection["stage"] =
            level === "Intermediate" || level === "Advanced"
                ? level
                : "Beginner";

        const topics: RoadmapTopic[] = Array.isArray(section?.topics)
            ? section.topics.map((topic: any, topicIndex: number) => {
                const title = String(topic?.title || `Topic ${topicIndex + 1}`);
                const existingResources = Array.isArray(topic?.resources) && topic.resources.length > 0
                    ? topic.resources
                    : null;

                // Generate fallback resources from topic title if none exist
                const fallbackResources = [
                    { title: `${title} Tutorial`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}`, type: "video" as const },
                    { title: `Learn ${title}`, url: `https://www.coursera.org/search?query=${encodeURIComponent(title)}`, type: "course" as const },
                ];

                return {
                    id: String(topic?.id || `s${sectionIndex + 1}-t${topicIndex + 1}`),
                    title,
                    description: String(topic?.description || ""),
                    estimated_hours: typeof topic?.estimated_hours === "number" ? topic.estimated_hours : 4,
                    resources: existingResources || fallbackResources,
                };
            })
            : [];

        return {
            id: String(section?.id || `section-${sectionIndex + 1}`),
            title: String(section?.title || `${stage} Foundations`),
            stage,
            estimated_weeks: typeof section?.estimated_weeks === "number" ? section.estimated_weeks : 4,
            topics,
        };
    });
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
            // Even cache hits should link the user if not linked yet
            if (body.user_id) {
                await supabase.from(TABLES.USERS).update({ target_career: cached.career }).eq("id", body.user_id);
                await supabase.from(TABLES.PROGRESS).upsert({
                    user_id: body.user_id, roadmap_id: cached.id, career: cached.career,
                    completed_topic_ids: [], current_section: (cached.sections as any[])[0]?.title || "Getting Started",
                    overall_progress_percent: 0, last_activity_at: new Date().toISOString(), updated_at: new Date().toISOString()
                }, { onConflict: "user_id, roadmap_id" });
            }
            return NextResponse.json<ApiResponse<RoadmapResponse>>({
                success: true,
                data: { roadmap: cached as Roadmap },
                message: "Loaded from cache.",
            });
        }

        // ── Rate Limiting (3 new generations per user per day) ────
        if (body.user_id) {
            const { allowed, remaining, resetInMs } = checkRateLimit(body.user_id, "roadmap", 3);
            if (!allowed) {
                const resetMins = Math.ceil(resetInMs / 60000);
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Daily roadmap generation limit reached. You can generate up to 3 new roadmaps per day. Resets in ${resetMins} minutes.` },
                    { status: 429, headers: { 'Retry-After': String(Math.ceil(resetInMs / 1000)) } }
                );
            }
            console.log(`[/api/roadmap] User ${body.user_id} — ${remaining} new roadmap generations remaining today.`);
        }

        // ── Generate with Gemini ─────────────────────────────────
        const prompt = buildRoadmapPrompt({
            career: body.career,
            domain: body.domain,
            current_level: body.current_level ?? "beginner",
        });

        const generatedText = await generateGemini(prompt);
        const generated = JSON.parse(generatedText);

        // Sanitize sections: ensure it's an array and normalise to RoadmapSection shape
        const rawSections = Array.isArray(generated.sections)
            ? generated.sections
            : [];
        const sections = normaliseSections(rawSections);

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

        // ── Link to user and initialize progress ─────────────────
        if (body.user_id) {
            console.log(`[/api/roadmap] Linking to user: ${body.user_id}`);
            
            // 1. Update user profile target career
            const { error: userError } = await supabase
                .from(TABLES.USERS)
                .update({ target_career: roadmap.career })
                .eq("id", body.user_id);
            
            if (userError) console.error("[/api/roadmap] Failed to link career to user:", userError.message);

            // 2. Initialize progress record (upsert)
            const { error: progressError } = await supabase
                .from(TABLES.PROGRESS)
                .upsert({
                    user_id: body.user_id,
                    roadmap_id: roadmap.id,
                    career: roadmap.career,
                    completed_topic_ids: [],
                    current_section: roadmap.sections[0]?.title || "Getting Started",
                    overall_progress_percent: 0,
                    last_activity_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: "user_id, roadmap_id" });
            
            if (progressError) console.error("[/api/roadmap] Failed to initialize progress:", progressError.message);
        }

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
