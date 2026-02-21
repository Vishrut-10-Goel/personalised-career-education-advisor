import axios from "axios";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "phi3";

// ─────────────────────────────────────────────
// Core: single-turn text completion
// ─────────────────────────────────────────────
export async function callOllama(prompt: string): Promise<string> {
    try {
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt,
                stream: false,
            },
            {
                headers: { "Content-Type": "application/json" },
                // Give local model enough time to respond
                timeout: 120_000,
            }
        );

        const text: string = response.data?.response;

        if (!text) {
            throw new Error("Ollama returned an empty response.");
        }

        return text;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (!error.response) {
                throw new Error(
                    `Cannot reach Ollama at ${OLLAMA_BASE_URL}. Is it running? (ollama serve)`
                );
            }
            throw new Error(
                `Ollama request failed with HTTP ${status}: ${JSON.stringify(error.response.data)}`
            );
        }
        throw error;
    }
}

// ─────────────────────────────────────────────
// Internal: robust JSON extraction from LLM output
// Handles:
//   - ```json ... ``` fences (anywhere in string)
//   - preamble text before/after the JSON object
//   - extra whitespace and newlines from phi3
// ─────────────────────────────────────────────
function extractJSON(raw: string): string {
    // Step 1: strip ALL markdown code fences (```json or ```)
    let text = raw.replace(/```(?:json)?/gi, "").trim();

    // Step 2: find the first '{' and the last '}' — extract that slice
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        throw new Error(
            `No JSON object found in Ollama response.\nRaw:\n${raw.slice(0, 600)}`
        );
    }

    const candidate = text.slice(start, end + 1);

    // Step 3: validate by parsing (throws if still malformed)
    try {
        JSON.parse(candidate);
    } catch {
        throw new Error(
            `Extracted JSON is still invalid.\nExtracted:\n${candidate.slice(0, 600)}`
        );
    }

    return candidate;
}

// ─────────────────────────────────────────────
// JSON variant: auto-parse Ollama response
// ─────────────────────────────────────────────
export async function callOllamaJSON<T>(prompt: string): Promise<T> {
    const raw = await callOllama(prompt);

    const cleaned = extractJSON(raw);

    // Safe to parse — extractJSON already validated it
    return JSON.parse(cleaned) as T;
}


// ─────────────────────────────────────────────
// Chat variant: build a prompt from history
// Ollama generate doesn't have native multi-turn
// chat, so we format history into the prompt.
// ─────────────────────────────────────────────
export async function callOllamaChat(
    systemPrompt: string,
    history: Array<{ role: "user" | "assistant"; content: string }>,
    newMessage: string
): Promise<string> {
    // Format context as a readable conversation block
    const conversationContext = history
        .slice(-10) // cap last 10 turns to avoid token overload
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

    const fullPrompt = [
        systemPrompt,
        conversationContext ? `\n\nConversation so far:\n${conversationContext}` : "",
        `\nUser: ${newMessage}`,
        "\nAssistant:",
    ]
        .filter(Boolean)
        .join("");

    return callOllama(fullPrompt);
}
