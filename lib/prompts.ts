import type { Domain, EducationLevel } from "@/types/user";

// ─────────────────────────────────────────────
// Career Recommendation Prompt
// ─────────────────────────────────────────────
export const buildRecommendPrompt = (params: {
  skills: string[];
  interests: string[];
  education_level: EducationLevel | string;
  domain: Domain | string;
}): string => {
  return `Recommend 3 careers for a ${params.domain} student.
Skills: ${params.skills.join(", ")}
Interests: ${params.interests.join(", ")}
Level: ${params.education_level}

Output ONLY valid JSON:
{
  "recommendations": [
    { "title": "Career Name", "description": "Short explanation." }
  ],
  "analysis_summary": "Short rationale."
}`.trim();
};

// ─────────────────────────────────────────────
// Roadmap Generation Prompt
// ─────────────────────────────────────────────
export const buildRoadmapPrompt = (params: {
  career: string;
  domain: string;
  current_level?: string;
}): string => `
You are a senior curriculum designer. Generate a structured learning roadmap.
Respond ONLY with a valid JSON object.

Career: ${params.career}
Domain: ${params.domain}
Current Level: ${params.current_level ?? "beginner"}

Output format:
{
  "career": "${params.career}",
  "overview": "Brief overview of this career path.",
  "total_estimated_weeks": 24,
  "sections": [
    {
      "level": "Beginner",
      "topics": [
        { "id": "b1", "title": "Topic Title", "description": "Brief description." },
        { "id": "b2", "title": "Topic Title", "description": "Brief description." }
      ]
    },
    {
      "level": "Intermediate",
      "topics": [
        { "id": "i1", "title": "Topic Title", "description": "Brief description." },
        { "id": "i2", "title": "Topic Title", "description": "Brief description." }
      ]
    },
    {
      "level": "Advanced",
      "topics": [
        { "id": "a1", "title": "Topic Title", "description": "Brief description." },
        { "id": "a2", "title": "Topic Title", "description": "Brief description." }
      ]
    }
  ]
}

Ensure at least 3 topics per section. Do not include any text outside the JSON.
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
