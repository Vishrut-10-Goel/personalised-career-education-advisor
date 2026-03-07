# Database Schema

## Tables

### Table: `user_profiles`
Purpose: Stores core user information and career preferences.
Fields:
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `full_name`: String
- `domain`: String (Enum-like)
- `education_level`: String
- `skills`: JSONB / Array of Strings
- `interests`: JSONB / Array of Strings
- `target_career`: String (Active career path)
- `password`: String (Manually hashed/stored for local bypass)
- `updated_at`: Timestamp
- `created_at`: Timestamp

### Table: `roadmaps`
Purpose: Caches generated AI career roadmaps.
Fields:
- `id`: UUID (Primary Key)
- `career`: String (Slugified/Lowercased)
- `domain`: String (Slugified/Lowercased)
- `overview`: Text
- `total_estimated_weeks`: Integer
- `sections`: JSONB (Array of modules and topics)
- `created_at`: Timestamp

### Table: `user_progress`
Purpose: Links users to specific roadmaps and tracks their completion.
Fields:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> user_profiles)
- `roadmap_id`: UUID (Foreign Key -> roadmaps)
- `career`: String
- `completed_topic_ids`: JSONB (Array of string IDs)
- `current_section`: String
- `overall_progress_percent`: Float
- `last_activity_at`: Timestamp
- `updated_at`: Timestamp

### Table: `chat_sessions`
Purpose: Persists AI assistant conversation history.
Fields:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> user_profiles)
- `career_context`: String
- `title`: String
- `messages`: JSONB (Array of role/content objects)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Relationships
- `user_profiles` (1) → (M) `user_progress`
- `roadmaps` (1) → (M) `user_progress`
- `user_profiles` (1) → (M) `chat_sessions`
