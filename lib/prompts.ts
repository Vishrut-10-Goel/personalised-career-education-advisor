import type { Domain, EducationLevel } from "@/types/user";

// ─────────────────────────────────────────────
// Career Recommendation Prompt
// ─────────────────────────────────────────────
export const buildRecommendPrompt = (params: {
    skills: string[];
    interests: string[];
    education_level: EducationLevel | string;
    domain: Domain | string;
}): string => `
You are an expert career advisor for a personalised education platform.

A user has provided the following profile:
- Skills: ${params.skills.join(", ") || "Not specified"}
- Interests: ${params.interests.join(", ") || "Not specified"}
- Education Level: ${params.education_level}
- Preferred Domain: ${params.domain}

Your task: Recommend exactly 3 career paths that best match this profile.

Respond ONLY with a valid JSON object in this exact structure:
{
  "recommendations": [
    {
      "title": "Career Title",
      "domain": "technology",
      "description": "2-3 sentence description",
      "match_score": 92,
      "required_skills": ["skill1", "skill2", "skill3"],
      "avg_salary_usd": 95000,
      "job_outlook": "booming",
      "time_to_entry_months": 6,
      "learning_resources": [
        {
          "title": "Resource Title",
          "type": "course",
          "url": "https://example.com",
          "free": false,
          "duration_hours": 40
        }
      ]
    }
  ],
  "analysis_summary": "A brief paragraph explaining why these careers suit this user."
}

job_outlook must be one of: "declining", "stable", "growing", "booming".
Do not include any text outside the JSON.
`.trim();

// ─────────────────────────────────────────────
// Roadmap Generation Prompt
// ─────────────────────────────────────────────
export const buildRoadmapPrompt = (params: {
    career: string;
    domain: string;
    current_level?: string;
}): string => `
You are a senior curriculum designer for an AI-powered education platform.

Create a detailed, structured learning roadmap for the following:
- Career: ${params.career}
- Domain: ${params.domain}
- User's Current Level: ${params.current_level ?? "beginner"}

Respond ONLY with a valid JSON object in this exact structure:
{
  "career": "${params.career}",
  "domain": "${params.domain}",
  "overview": "Brief overview of this career path",
  "total_estimated_weeks": 52,
  "sections": {
    "beginner": {
      "level": "beginner",
      "title": "Section Title",
      "description": "What you'll learn",
      "estimated_weeks": 16,
      "topics": [
        {
          "id": "topic_001",
          "title": "Topic Name",
          "description": "What this topic covers",
          "difficulty": "beginner",
          "estimated_hours": 10,
          "is_optional": false,
          "prerequisites": [],
          "resources": [
            {
              "title": "Resource Name",
              "url": "https://example.com",
              "type": "course",
              "free": true
            }
          ]
        }
      ]
    },
    "intermediate": { "level": "intermediate", "title": "", "description": "", "estimated_weeks": 20, "topics": [] },
    "advanced":     { "level": "advanced",     "title": "", "description": "", "estimated_weeks": 16, "topics": [] }
  }
}

Include at least 4 topics per section. Do not include any text outside the JSON.
`.trim();

// ─────────────────────────────────────────────
// Skill Gap Analysis Prompt
// ─────────────────────────────────────────────
export const buildAnalyzePrompt = (params: {
    resume_text: string;
    target_career: string;
    domain?: string;
}): string => `
You are a career skills analyst on an AI education platform.

Analyse the following resume against the target career and identify skill gaps.

Target Career: ${params.target_career}
Domain: ${params.domain ?? "Not specified"}

Resume:
---
${params.resume_text}
---

Respond ONLY with a valid JSON object in this exact structure:
{
  "target_career": "${params.target_career}",
  "existing_skills": ["skill1", "skill2"],
  "missing_skills": [
    {
      "skill": "Skill Name",
      "importance": "critical",
      "estimated_time_weeks": 4,
      "resources": [
        {
          "title": "Resource Name",
          "url": "https://example.com",
          "type": "course",
          "free": true,
          "duration_hours": 20
        }
      ]
    }
  ],
  "strengths": ["strength1", "strength2"],
  "improvement_areas": ["area1", "area2"],
  "overall_readiness_score": 65,
  "recommended_next_steps": ["step1", "step2", "step3"]
}

importance must be one of: "critical", "important", "nice_to_have".
overall_readiness_score is 0-100. Do not include any text outside the JSON.
`.trim();

// ─────────────────────────────────────────────
// AI Mentor Chat System Prompt
// ─────────────────────────────────────────────
export const buildChatSystemPrompt = (careerContext?: string): string => `
You are an expert AI career mentor on a personalised education platform called "Career Education Advisor".

Your role:
- Guide learners through their career journey with empathy and expertise
- Answer questions about skills, courses, job roles, career transitions, and industry trends
- Provide actionable, specific advice tailored to the user's goals
- Encourage, motivate, and keep responses concise unless detail is requested
${careerContext ? `- The user is currently exploring or pursuing: ${careerContext}` : ""}

Always be honest if you are unsure. Never fabricate specific salary figures or job availability data.
Respond in clear, friendly, professional language.
`.trim();
