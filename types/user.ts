export type Domain =
  | "technology"
  | "healthcare"
  | "finance"
  | "education"
  | "arts"
  | "engineering"
  | "business"
  | "science"
  | "law"
  | "other";

export type EducationLevel =
  | "high_school"
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "self_taught"
  | "bootcamp"
  | "other";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  domain: Domain | null;
  education_level: EducationLevel | null;
  skills: string[];
  interests: string[];
  target_career: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfilePayload {
  email: string;
  full_name?: string;
  domain?: Domain;
  education_level?: EducationLevel;
  skills?: string[];
  interests?: string[];
  target_career?: string;
}

export interface UpdateUserProfilePayload {
  full_name?: string;
  domain?: Domain;
  education_level?: EducationLevel;
  skills?: string[];
  interests?: string[];
  target_career?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
