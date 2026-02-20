export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
    role: MessageRole;
    content: string;
    timestamp?: string;
}

export interface ChatSession {
    id: string;
    user_id: string;
    title: string | null;
    career_context: string | null;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
}

export interface ChatRequestPayload {
    conversation_history: ChatMessage[];
    new_message: string;
    career_context?: string;
    user_id?: string;
    session_id?: string;
}

export interface ChatResponse {
    reply: string;
    session_id?: string;
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
}
