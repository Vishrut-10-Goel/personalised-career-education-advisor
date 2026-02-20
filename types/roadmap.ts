export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface RoadmapTopic {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    estimated_hours: number;
    resources: RoadmapResource[];
    prerequisites: string[]; // topic IDs
    is_optional: boolean;
}

export interface RoadmapResource {
    title: string;
    url?: string;
    type: "article" | "video" | "course" | "book" | "project" | "docs";
    free: boolean;
}

export interface RoadmapSection {
    level: Difficulty;
    title: string;
    description: string;
    topics: RoadmapTopic[];
    estimated_weeks: number;
}

export interface Roadmap {
    id: string;
    career: string;
    domain: string;
    overview: string;
    total_estimated_weeks: number;
    sections: {
        beginner: RoadmapSection;
        intermediate: RoadmapSection;
        advanced: RoadmapSection;
    };
    created_at: string;
}

export interface RoadmapRequestPayload {
    career: string;
    domain: string;
    current_level?: Difficulty;
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
    current_section: Difficulty;
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
    current_section: Difficulty;
    estimated_weeks_remaining: number;
    last_activity_at: string;
}
