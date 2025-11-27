import { ref, computed } from "vue";
import apiService from "@/services/api";
import type { User, RegisterRequest, LoginRequest, ApiError } from "@/types";

const user = ref<User | null>(null);
const token = ref<string | null>(null);
const error = ref<ApiError | null>(null);
const loading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => {
    if (!user.value) return "";
    if (user.value.firstName && user.value.lastName) {
      return `${user.value.firstName} ${user.value.lastName}`;
    }
    return user.value.username || user.value.email || "";
  });

  const loadAuthFromStorage = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) token.value = storedToken;
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("user");
      }
    }
  };

  const saveAuthToStorage = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = async (req: RegisterRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.register(req);
      // Don't save token on registration, just return response
      return response;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (req: LoginRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.login(req);
      if (response.token && response.user) {
        saveAuthToStorage(response.token, response.user);
      }
      return response;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const updateProfile = async (profileData: Partial<User>) => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await apiService.updateProfile(profileData);
      user.value = { ...user.value, ...updated };
      localStorage.setItem("user", JSON.stringify(user.value));
      return updated;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const profile = await apiService.getProfile();
      user.value = profile;
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (err) {
      if (!user.value) {
        error.value = err as ApiError;
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    userName,
    loadAuthFromStorage,
    register,
    login,
    logout,
    updateProfile,
    getProfile,
  };
}
