import { NextRequest, NextResponse } from "next/server";
import { callOllamaJSON } from "@/lib/ollama";
import { buildRecommendPrompt } from "@/lib/prompts";
import type { RecommendRequestPayload, RecommendResponse } from "@/types/career";
import type { ApiResponse } from "@/types/user";

// ── Domain-based fallback when Ollama fails / returns invalid JSON ──
function makePath(
    title: string,
    description: string,
    match_score: number,
    required_skills: string[],
    domain: string,
): RecommendResponse["recommendations"][number] {
    return {
        title,
        description,
        match_score,
        required_skills,
        domain: domain as import("@/types/user").Domain,
        avg_salary_usd: 0,
        job_outlook: "growing",
        time_to_entry_months: 12,
        learning_resources: [],
    };
}

function getFallback(domain: string): RecommendResponse {
    const map: Record<string, RecommendResponse["recommendations"]> = {
        "Technology & IT": [
            makePath("Software Engineer", "Build and maintain software systems across web, mobile, and backend platforms.", 90, ["Programming", "Problem Solving", "Teamwork"], domain),
            makePath("Data Scientist", "Extract insights from data using statistics, machine learning, and visualisation tools.", 85, ["Python", "Statistics", "Analysis"], domain),
            makePath("Cloud DevOps Engineer", "Manage cloud infrastructure, CI/CD pipelines, and system reliability.", 80, ["Linux", "AWS/Azure", "Automation"], domain),
        ],
        "Medical & Healthcare": [
            makePath("MBBS Doctor", "Diagnose and treat patients across a broad range of medical conditions.", 90, ["Biology", "Communication", "Critical Thinking"], domain),
            makePath("Nurse Practitioner", "Provide direct patient care and coordinate healthcare plans in clinical settings.", 85, ["Clinical Skills", "Empathy", "Teamwork"], domain),
            makePath("Medical Researcher", "Conduct scientific research to advance treatments and medical knowledge.", 80, ["Research", "Lab Skills", "Analysis"], domain),
        ],
        "Arts & Creative": [
            makePath("Animator", "Create high-quality animations and visual effects for film and games.", 90, ["Drawing", "Software", "Creativity"], domain),
            makePath("Creative Director", "Lead visual style and strategy for branding and multimedia campaigns.", 85, ["Leadership", "Design", "Vision"], domain),
            makePath("Fine Artist", "Express concepts and emotions through varied physical or digital media.", 80, ["Technique", "Creativity", "Portfolio"], domain),
        ],
        "Commerce & Finance": [
            makePath("Chartered Accountant", "Manage financial planning, auditing, and tax compliance for organisations.", 90, ["Accounting", "Analysis", "Attention to Detail"], domain),
            makePath("Investment Analyst", "Evaluate financial markets and guide investment decisions for clients.", 85, ["Finance", "Research", "Communication"], domain),
            makePath("Business Consultant", "Advise organisations on strategy, operations, and business growth.", 80, ["Problem Solving", "Leadership", "Communication"], domain),
        ],
        "Government & Civil Services": [
            makePath("IAS Officer", "Administer public policy and government operations across districts and states.", 90, ["Leadership", "Communication", "Analysis"], domain),
            makePath("Policy Analyst", "Research and recommend policy solutions for government and public sector bodies.", 85, ["Research", "Writing", "Critical Thinking"], domain),
            makePath("Defence Officer", "Serve in the armed forces, managing national security and operations.", 80, ["Leadership", "Discipline", "Teamwork"], domain),
        ],
        "Research & Academia": [
            makePath("Research Scientist", "Conduct advanced experiments to discover and validate new scientific theories.", 90, ["Methodology", "Analysis", "Persistence"], domain),
            makePath("University Professor", "Teach higher education and lead independent research projects.", 85, ["Teaching", "Research", "Communication"], domain),
            makePath("Data Research Analyst", "Process scientific or industrial data to identify valuable trends.", 80, ["Statistics", "Analysis", "Software"], domain),
        ],
        "Entrepreneurship": [
            makePath("Startup Founder", "Build a company from scratch by identifying market gaps and scaling solutions.", 90, ["Vision", "Leadership", "Risk-taking"], domain),
            makePath("Product Innovator", "Develop new product concepts and oversee their market validation.", 85, ["Design", "Strategy", "User Research"], domain),
            makePath("Venture Builder", "Systematically launch and grow multiple new business ventures.", 80, ["Scale", "Funding", "Operations"], domain),
        ],
        "Law & Judiciary": [
            makePath("Corporate Lawyer", "Advise businesses on legal rights, duties, and professional responsibilities.", 90, ["Law", "Negotiation", "Logic"], domain),
            makePath("Civil Judge", "Preside over legal proceedings and ensure justice is served according to law.", 85, ["Ethics", "Law", "Critical Thinking"], domain),
            makePath("Legal Advisor", "Provide expert legal guidance to individuals or non-profit organizations.", 80, ["Law", "Communication", "Drafting"], domain),
        ],
        "Design & Media": [
            makePath("UI/UX Designer", "Design intuitive and aesthetically pleasing digital interfaces for users.", 90, ["Figma", "Interaction Design", "Psychology"], domain),
            makePath("Graphic Designer", "Communicate ideas through visual content using typography and imagery.", 85, ["Color Theory", "Adobe Suite", "Visual Arts"], domain),
            makePath("Content Strategist", "Plan and manage multimedia content to achieve marketing and user goals.", 80, ["Writing", "Strategy", "Media Skills"], domain),
        ],
        "Skilled Trades": [
            makePath("Electrician", "Install and repair electrical systems for residential or industrial use.", 90, ["Technical Skills", "Safety", "Manual Dexterity"], domain),
            makePath("CNC Machinist", "Operate precision computer-controlled machinery to fabricate complex parts.", 85, ["Mathematics", "Precision", "Technical Drawing"], domain),
            makePath("HVAC Technician", "Maintain heating, ventilation, and air conditioning systems in buildings.", 80, ["Mechanics", "Troubleshooting", "Efficiency"], domain),
        ]
    };

    const careers = map[domain] || [
        makePath("Project Manager", "Plan and execute projects across industries by coordinating teams and resources.", 85, ["Leadership", "Communication", "Planning"], domain),
        makePath("Business Analyst", "Bridge business needs and technical solutions through analysis and documentation.", 80, ["Analysis", "Communication", "Problem Solving"], domain),
        makePath("Entrepreneur", "Build and scale your own business venture from ideation to market.", 78, ["Creativity", "Leadership", "Resilience"], domain),
    ];

    return { recommendations: careers, analysis_summary: `AI generation timed out or failed. Providing curated recommendations for ${domain}.` };
}

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

        console.log(`[/api/recommend] Requesting AI (Domain: ${body.domain})`);
        const startTime = Date.now();

        let result: RecommendResponse;

        try {
            // Task: Implement timeout (300s for very slow local LLMs)
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("AI_TIMEOUT")), 300000)
            );

            const aiPromise = callOllamaJSON<any>(prompt);

            const raw = await Promise.race([aiPromise, timeoutPromise]);
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);

            console.log(`[/api/recommend] Ollama responded in ${duration}s`);

            // Priority 1: Nested array format { recommendations: [{ title, description }] }
            if (raw.recommendations && Array.isArray(raw.recommendations)) {
                result = {
                    recommendations: raw.recommendations.map((r: any) => ({
                        ...makePath(r.title || "Untitled", r.description || "No description", 90, [], body.domain)
                    })),
                    analysis_summary: `${raw.analysis_summary || "AI-generated recommendations."} (Generated in ${duration}s)`,
                };
            }
            // Priority 2: Flat format { title1, desc1, ... }
            else if (raw.title1 && raw.desc1) {
                result = {
                    recommendations: [
                        makePath(raw.title1 as string, raw.desc1 as string, 90, [], body.domain),
                        makePath((raw.title2 ?? "") as string, (raw.desc2 ?? "") as string, 85, [], body.domain),
                        makePath((raw.title3 ?? "") as string, (raw.desc3 ?? "") as string, 80, [], body.domain),
                    ].filter(r => r.title),
                    analysis_summary: `${raw.summary || raw.analysis_summary || "AI-generated recommendations."} (Generated in ${duration}s)`,
                };
            } else {
                throw new Error("UNEXPECTED_JSON_SHAPE");
            }
        } catch (error) {
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            const errLabel = error instanceof Error ? error.message : "UNKNOWN";
            console.warn(`[/api/recommend] AI ${errLabel} after ${duration}s, using fallback for ${body.domain}`);

            result = getFallback(body.domain);
            // Append the error to the summary so the user can see it in the UI cards
            result.analysis_summary = `AI Error: ${errLabel} (after ${duration}s). Loading fallbacks for ${body.domain}...`;
        }

        return NextResponse.json<ApiResponse<RecommendResponse>>({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("[/api/recommend] Fatal Error:", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500 }
        );
    }
}
