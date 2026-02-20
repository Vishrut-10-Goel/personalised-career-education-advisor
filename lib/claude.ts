import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "@/types/chat";

// ─────────────────────────────────────────────
// Client singleton
// ─────────────────────────────────────────────
const getClient = (): Anthropic => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error(
            "ANTHROPIC_API_KEY is not set in environment variables."
        );
    }
    return new Anthropic({ apiKey });
};

// Default model – override via env for easy upgrades
const MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-20241022";
const DEFAULT_MAX_TOKENS = 4096;

// ─────────────────────────────────────────────
// Core: single-turn text completion
// ─────────────────────────────────────────────
export async function claudeComplete(
    prompt: string,
    options: {
        system?: string;
        maxTokens?: number;
        temperature?: number;
    } = {}
): Promise<string> {
    const client = getClient();

    const response = await client.messages.create({
        model: MODEL,
        max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        ...(options.system && { system: options.system }),
        messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude API.");
    }

    return content.text;
}

// ─────────────────────────────────────────────
// Core: parse JSON response (with retry logic)
// ─────────────────────────────────────────────
export async function claudeJSON<T>(
    prompt: string,
    options: {
        system?: string;
        maxTokens?: number;
    } = {}
): Promise<T> {
    const raw = await claudeComplete(prompt, {
        ...options,
        maxTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    });

    // Strip potential markdown code fences
    const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
        return JSON.parse(cleaned) as T;
    } catch {
        throw new Error(
            `Claude returned invalid JSON.\nRaw response:\n${raw.slice(0, 500)}`
        );
    }
}

// ─────────────────────────────────────────────
// Multi-turn chat completion
// ─────────────────────────────────────────────
export async function claudeChat(
    history: ChatMessage[],
    newMessage: string,
    systemPrompt: string,
    options: {
        maxTokens?: number;
    } = {}
): Promise<{ reply: string; usage: { input_tokens: number; output_tokens: number } }> {
    const client = getClient();

    // Build message array (exclude system messages from history)
    const messages: Anthropic.MessageParam[] = [
        ...history
            .filter((m) => m.role !== "system")
            .map((m) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            })),
        { role: "user", content: newMessage },
    ];

    const response = await client.messages.create({
        model: MODEL,
        max_tokens: options.maxTokens ?? 1024,
        system: systemPrompt,
        messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude API.");
    }

    return {
        reply: content.text,
        usage: {
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens,
        },
    };
}
