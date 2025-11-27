import { ref } from "vue";
import apiService from "@/services/api";
import type { ApiError, Job, Mentor, Case, Recommendation } from "@/types";

const jobs = ref<Job[]>([]);
const mentors = ref<Mentor[]>([]);
const cases_ = ref<Case[]>([]);
const recommendations = ref<Recommendation[]>([]);
const vacancies = ref<any[]>([]);
const vacanciesTotal = ref(0);
const error = ref<ApiError | null>(null);
const loading = ref(false);

export function useApi() {
  const fetchJobs = async () => {
    loading.value = true;
    error.value = null;
    try {
      jobs.value = await apiService.getJobs();
    } catch (err) {
      error.value = err as ApiError;
    } finally {
      loading.value = false;
    }
  };

  const fetchMentors = async () => {
    loading.value = true;
    error.value = null;
    try {
      mentors.value = await apiService.getMentors();
    } catch (err) {
      error.value = err as ApiError;
    } finally {
      loading.value = false;
    }
  };

  const fetchCases = async () => {
    loading.value = true;
    error.value = null;
    try {
      cases_.value = await apiService.getCases();
    } catch (err) {
      error.value = err as ApiError;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecommendations = async () => {
    loading.value = true;
    error.value = null;
    try {
      recommendations.value = await apiService.getRecommendations();
    } catch (err) {
      error.value = err as ApiError;
    } finally {
      loading.value = false;
    }
  };

  const fetchVacancies = async (params?: {
    text?: string;
    page?: number;
    per_page?: number;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.searchVacancies(params);
      vacancies.value = response.items || [];
      vacanciesTotal.value = response.found || 0;
    } catch (err) {
      error.value = err as ApiError;
      vacancies.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    jobs,
    mentors,
    cases: cases_,
    recommendations,
    vacancies,
    vacanciesTotal,
    error,
    loading,
    fetchJobs,
    fetchMentors,
    fetchCases,
    fetchRecommendations,
    fetchVacancies,
  };
}
