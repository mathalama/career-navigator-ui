import axios, { type AxiosInstance } from "axios";
import type {
  ApiError,
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Job,
  Mentor,
  Case,
  Recommendation,
} from "@/types";

// Use relative '/api' in dev (proxied by Vite), allow override via VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor: add auth token
    this.client.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor: handle errors
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.hash = "#/login";
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.error ||
        error.message ||
        "Unknown error";
      return {
        message,
        status: error.response?.status,
        body: error.response?.data,
      };
    }
    return { message: "Unknown error" };
  }

  // Auth endpoints
  async register(req: RegisterRequest): Promise<any> {
    const { data } = await this.client.post("/auth/register", req);
    return data;
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>("/auth/login", req);
    return data;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await this.client.post("/auth/verify-email", { token });
    return data;
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const { data } = await this.client.post("/auth/resend-verification", {
      email,
    });
    return data;
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    const { data } = await this.client.get<User>("/profile/get");
    return data;
  }

  async updateProfile(profile: Partial<User>): Promise<User> {
    const { data } = await this.client.put<User>("/profile/update", profile);
    return data;
  }

  async saveSkills(skillsData: string): Promise<User> {
    const { data } = await this.client.put<User>("/profile/update", {
      skills: skillsData,
    });
    return data;
  }

  // Data endpoints
  async getJobs(): Promise<Job[]> {
    const { data } = await this.client.get<Job[]>("/jobs");
    return data;
  }

  async getMentors(): Promise<Mentor[]> {
    const { data } = await this.client.get<Mentor[]>("/mentors");
    return data;
  }

  async getCases(): Promise<Case[]> {
    const { data } = await this.client.get<Case[]>("/cases");
    return data;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    const { data } = await this.client.get<Recommendation[]>(
      "/recommendations"
    );
    return data;
  }

  async createItem(item: unknown): Promise<unknown> {
    const { data } = await this.client.post("/items/create", item);
    return data;
  }

  // HeadHunter API
  async searchVacancies(params?: {
    text?: string;
    page?: number;
    per_page?: number;
    experience?: string;
    schedule?: string;
    only_with_salary?: boolean;
  }): Promise<any> {
    const { data } = await this.client.get("/hh/vacancies", { params });
    return data;
  }
}

export default new ApiService();
