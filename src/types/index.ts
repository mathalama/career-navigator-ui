export interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  skills?: string;
  interests?: string;
  experience?: string;
  role?: string;
}

export interface RegisterRequest {
  username: string; // must be unique
  email: string;
  password: string;
}

export interface LoginRequest {
  identifier: string; // email or username
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface ApiError {
  message: string;
  status?: number;
  body?: unknown;
}

export interface Job {
  id?: number;
  title: string;
  company: string;
  location: string;
  tags: string[];
}

export interface Mentor {
  id?: number;
  name: string;
  role: string;
  area: string;
}

export interface Case {
  id?: number;
  title: string;
  company: string;
  difficulty: string;
}

export interface Recommendation {
  id?: number;
  title: string;
  description?: string;
}

export interface Review {
  id?: number;
  mentorId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// HeadHunter API types
export interface HHVacancy {
  id: string;
  name: string;
  employer: {
    name: string;
    logo_urls?: {
      original?: string;
      "240"?: string;
    };
  };
  area: {
    name: string;
  };
  salary?: {
    from?: number;
    to?: number;
    currency: string;
  };
  snippet?: {
    requirement?: string;
    responsibility?: string;
  };
  published_at: string;
  alternate_url: string;
  schedule?: {
    name: string;
  };
  experience?: {
    name: string;
  };
}

export interface HHSearchParams {
  text?: string;
  page?: number;
  per_page?: number;
  experience?: string; // noExperience, between1And3, between3And6, moreThan6
  schedule?: string; // fullDay, shift, flexible, remote, flyInFlyOut
  only_with_salary?: boolean;
}

export interface HHSearchResponse {
  items: HHVacancy[];
  found: number;
  pages: number;
  page: number;
  per_page: number;
}

// Skills types
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Skill {
  name: string;
  selected: boolean;
  level?: SkillLevel;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: string[];
}
