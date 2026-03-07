# API Contracts

## Career Recommendations
**Method:** `POST`
**Path:** `/api/recommend`
**Request Payload:**
```json
{
  "skills": ["Python", "React"],
  "interests": ["Innovation"],
  "domain": "Technology & IT",
  "education_level": "bachelor"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "Software Engineer",
        "description": "...",
        "match_score": 95,
        "required_skills": ["Java", "SQL"],
        "avg_salary_usd": 110000,
        "job_outlook": "growing"
      }
    ],
    "analysis_summary": "AI generation metrics..."
  }
}
```

## Roadmap Management
**Method:** `POST`
**Path:** `/api/roadmap`
**Purpose:** Generates a new AI roadmap or returns from cache. Links the result to the user profile and initializes progress.
**Request Payload:**
```json
{
  "user_id": "uuid",
  "career": "Product Manager",
  "domain": "Technology & IT"
}
```

**Method:** `GET`
**Path:** `/api/roadmap?user_id=<uuid>` or `/api/roadmap?id=<roadmap_id>`
**Purpose:** Retrieves a roadmap. If `user_id` is provided, it prioritizes the user's active progress or target career.

## User Profile
**Method:** `GET | POST | PATCH`
**Path:** `/api/user`
**Usage:**
- `GET`: Fetch profile by `id` or `email` (supports password bypass).
- `POST`: Create or upsert a profile.
- `PATCH`: Partially update profile fields (e.g., updating target career).

## AI Chat
**Method:** `POST`
**Path:** `/api/chat`
**Request Payload:**
```json
{
  "new_message": "How do I start with React?",
  "career_context": "Software Engineer",
  "conversation_history": [],
  "user_id": "optional-uuid"
}
```
