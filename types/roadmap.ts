export interface RoadmapTopic {
    id: string; // Deterministic stable ID
    title: string;
    description: string;
    estimated_hours: number;
}

export interface RoadmapSection {
    id: string; // Deterministic stable ID
    title: string;
    stage: "Beginner" | "Intermediate" | "Advanced";
    estimated_weeks: number;
    topics: RoadmapTopic[];
}

export interface Roadmap {
    id: string;
    career: string;
    domain: string;
    overview: string;
    total_estimated_weeks: number;
    sections: RoadmapSection[];
    created_at: string;
}

export interface RoadmapRequestPayload {
    career: string;
    domain: string;
    current_level?: string;
    user_id?: string;
}

export interface RoadmapResponse {
    roadmap: Roadmap;
}

export interface UserProgress {
    id: string;
    user_id: string;
    roadmap_id: string;
    career: string;
    completed_topic_ids: string[];
    current_section: string;
    overall_progress_percent: number;
    last_activity_at: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateProgressPayload {
    user_id: string;
    roadmap_id: string;
    career: string;
    completed_topic_id: string;
}

export interface ProgressSummary {
    roadmap_id: string;
    career: string;
    total_topics: number;
    completed_topics: number;
    overall_progress_percent: number;
    current_section: string;
    estimated_weeks_remaining: number;
    last_activity_at: string;
}
