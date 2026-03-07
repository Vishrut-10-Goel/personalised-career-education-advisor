# API Contracts

## Career Recommendations
**Method:** `POST`
**Path:** `/api/recommend`
**AI Powered By:** Google Gemini (`generateGemini`)
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
    "analysis_summary": "AI analysis summary..."
  }
}
```
**Error Response (No Fallback):**
```json
{
  "success": false,
  "error": "GEMINI_API_ERROR_429: You exceeded your current quota..."
}
```

---

## Roadmap Generation
**Method:** `POST`
**Path:** `/api/roadmap`
**AI Powered By:** Google Gemini (`generateGemini`)
**Purpose:** Generates a new AI roadmap or returns from cache. Links the result to the user profile.
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
**Purpose:** Retrieves a roadmap. If `user_id` is provided, prioritizes the user's active roadmap.

---

## User Profile
**Method:** `GET | POST | PATCH`
**Path:** `/api/user`
**Usage:**
- `GET ?id=<uuid>` — Fetch profile by ID
- `GET ?email=<email>&password=<pw>` — Fetch profile with login verification
- `POST` — Create or upsert a profile (used at signup)
- `PATCH ?id=<uuid>` — Partially update profile fields

**POST Request Payload:**
```json
{
  "id": "generated-uuid-or-fallback",
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "plain-text-pw"
}
```

---

## AI Chatbot
**Method:** `POST`
**Path:** `/api/chat`
**AI Powered By:** Google Gemini (`generateGemini`)
**Request Payload:**
```json
{
  "new_message": "How do I start with React?",
  "career_context": "Software Engineer",
  "conversation_history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ],
  "user_id": "optional-uuid"
}
```
**Notes:**
- Conversation history is capped at the last **5 messages** to minimize token usage.
- No fallback response if Gemini fails — the exact error is returned.
