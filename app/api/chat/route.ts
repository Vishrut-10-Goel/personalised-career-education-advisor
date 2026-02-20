import { NextRequest, NextResponse } from "next/server";
import { claudeChat } from "@/lib/claude";
import { buildChatSystemPrompt } from "@/lib/prompts";
import { getServerSupabase, TABLES } from "@/lib/supabase";
import type { ChatRequestPayload, ChatResponse } from "@/types/chat";
import type { ApiResponse } from "@/types/user";

const MAX_HISTORY_MESSAGES = 20; // cap to control token usage

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequestPayload = await req.json();

        // ── Validation ──────────────────────────────────────────
        if (!body.new_message?.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "new_message is required." },
                { status: 400 }
            );
        }

        // Trim history to avoid context bloat
        const history = (body.conversation_history ?? []).slice(
            -MAX_HISTORY_MESSAGES
        );

        // ── Build system prompt ──────────────────────────────────
        const systemPrompt = buildChatSystemPrompt(body.career_context);

        // ── Call Claude ──────────────────────────────────────────
        const { reply, usage } = await claudeChat(
            history,
            body.new_message.trim(),
            systemPrompt,
            { maxTokens: 1024 }
        );

        // ── Optionally persist session ────────────────────────────
        let sessionId = body.session_id;
        if (body.user_id) {
            const supabase = getServerSupabase();

            if (!sessionId) {
                // Create a new session
                const { data: session } = await supabase
                    .from(TABLES.CHAT_SESSIONS)
                    .insert({
                        user_id: body.user_id,
                        career_context: body.career_context ?? null,
                        title: body.new_message.slice(0, 80),
                        messages: [
                            ...history,
                            { role: "user", content: body.new_message },
                            { role: "assistant", content: reply },
                        ],
                    })
                    .select("id")
                    .single();

                sessionId = session?.id;
            } else {
                // Append to existing session
                const { data: existing } = await supabase
                    .from(TABLES.CHAT_SESSIONS)
                    .select("messages")
                    .eq("id", sessionId)
                    .single();

                const updatedMessages = [
                    ...(existing?.messages ?? []),
                    { role: "user", content: body.new_message },
                    { role: "assistant", content: reply },
                ];

                await supabase
                    .from(TABLES.CHAT_SESSIONS)
                    .update({ messages: updatedMessages, updated_at: new Date().toISOString() })
                    .eq("id", sessionId);
            }
        }

        return NextResponse.json<ApiResponse<ChatResponse>>({
            success: true,
            data: { reply, session_id: sessionId, usage },
        });
    } catch (error) {
        console.error("[/api/chat] Error:", error);
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
