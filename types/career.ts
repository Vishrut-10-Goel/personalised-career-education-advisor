import type { Domain } from "./user";

export interface CareerPath {
    title: string;
    domain: Domain;
    description: string;
    match_score: number; // 0-100
    required_skills: string[];
    avg_salary_usd: number;
    job_outlook: "declining" | "stable" | "growing" | "booming";
    time_to_entry_months: number;
    learning_resources: LearningResource[];
}

export interface LearningResource {
    title: string;
    type: "course" | "book" | "video" | "article" | "project" | "certification";
    url?: string;
    free: boolean;
    duration_hours?: number;
}

export interface RecommendRequestPayload {
    skills: string[];
    interests: string[];
    education_level: string;
    domain: Domain;
    user_id?: string;
}

export interface RecommendResponse {
    recommendations: CareerPath[];
    analysis_summary: string;
}

export interface SkillGapItem {
    skill: string;
    importance: "critical" | "important" | "nice_to_have";
    estimated_time_weeks: number;
    resources: LearningResource[];
}

export interface AnalyzeRequestPayload {
    resume_text: string;
    target_career: string;
    domain?: Domain;
}

export interface AnalyzeResponse {
    target_career: string;
    existing_skills: string[];
    missing_skills: SkillGapItem[];
    strengths: string[];
    improvement_areas: string[];
    overall_readiness_score: number; // 0-100
    recommended_next_steps: string[];
}
