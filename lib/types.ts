// Database Models
export interface User {
  id: string
  email: string
  name: string
  college: string
  branch: string
  cgpa: number
  passout_date: string
  chosen_path: string
  created_at?: string
  updated_at?: string
}

export interface Milestone {
  id: string
  user_id: string
  milestone_title: string
  description: string
  due_date: string
  category: string
  status: string
  version: number
  created_at?: string
  updated_at?: string
}

export interface UserSkill {
  user_id: string
  skill_name: string
  confidence: number
  created_at?: string
}

export interface Roadmap {
  id: string
  user_id: string
  title: string
  description: string
  timeline: string
  milestones: Milestone[]
  created_at?: string
  updated_at?: string
}

// DTOs and Request/Response Types
export interface OnboardingProfile {
  name: string
  college: string
  cgpa: string
  branch: string
  semester: string
  passoutMonth: string
  passoutYear: string
  tier: string
  skills: Record<string, number>
  dreamFuture: string
  dreamTarget: string
  priority: string
  abroad: string
  funding: string
  reminderEmail: string
  reminderFreq: string
}

export interface RoadmapGenerationRequest {
  userId: string
  profile: OnboardingProfile
}

export interface RoadmapGenerationResponse {
  roadmap: Roadmap
  message: string
}

// Auth Types
export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export interface AuthResponse {
  user: AuthUser | null
  error: Error | null
}
