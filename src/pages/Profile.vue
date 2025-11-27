<template>
  <!-- Fullscreen initial loading overlay -->
  <div
    v-if="initialLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-accent"
      ></div>
      <div class="text-sm text-slate-700">Загружаем профиль...</div>
    </div>
  </div>

  <div class="mx-auto max-w-2xl">
    <div class="rounded-lg bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-medium">Мой профиль</h2>
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="rounded bg-accent-2 px-4 py-2 text-sm text-white"
        >
          Редактировать
        </button>
      </div>

      <div
        v-if="!initialLoading && error && !user"
        class="mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
      >
        {{ error.message }}
      </div>

      <div v-if="isEditing">
        <form @submit.prevent="handleSave" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-slate-700">Username</label>
              <input
                v-model="formData.username"
                type="text"
                required
                class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
              />
              <p class="mt-1 text-xs text-slate-500">
                Уникальный идентификатор
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Email</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
              />
              <p class="mt-1 text-xs text-slate-500">Адрес электронной почты</p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-slate-700">Имя</label>
              <input
                v-model="formData.firstName"
                type="text"
                class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Фамилия</label>
              <input
                v-model="formData.lastName"
                type="text"
                class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700"
              >Номер телефона</label
            >
            <input
              v-model="formData.phoneNumber"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700"
              >Опыт работы</label
            >
            <select
              v-model="formData.experience"
              class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
            >
              <option value="">Не указано</option>
              <option value="no_experience">Без опыта</option>
              <option value="less_than_1">Менее 1 года</option>
              <option value="1_to_3">1-3 года</option>
              <option value="3_to_5">3-5 лет</option>
              <option value="5_plus">5+ лет</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">Навыки</label>
            <div
              v-if="parsedSkills && parsedSkills.length > 0"
              class="mt-2 space-y-3"
            >
              <div
                v-for="(category, catIndex) in parsedSkills"
                :key="catIndex"
                class="rounded bg-slate-50 p-3"
              >
                <div class="text-sm text-slate-600 mb-2">
                  <span class="font-medium">{{ category.categoryName }}</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(skill, skillIndex) in category.skills"
                    :key="skillIndex"
                    class="inline-flex items-center gap-1.5 rounded-full bg-accent-2/10 border border-accent-2/30 px-3 py-1.5 text-xs font-medium text-accent-2"
                  >
                    {{ skill.name }}
                    <span class="text-xs opacity-75">
                      {{ getLevelStars(skill.level) }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <router-link
              to="/skills"
              class="mt-2 inline-block text-sm text-accent-2 hover:underline"
            >
              → {{ parsedSkills ? "Изменить навыки" : "Выбрать навыки" }}
            </router-link>
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">Интересы</label>
            <textarea
              v-model="formData.interests"
              rows="3"
              placeholder="Backend разработка, Machine Learning, DevOps..."
              class="mt-1 w-full rounded border px-3 py-2 focus:border-accent-2 focus:ring-2 focus:ring-accent-2/20"
            ></textarea>
          </div>

          <div
            v-if="formError"
            class="rounded bg-red-50 p-3 text-sm text-red-700"
          >
            {{ formError }}
          </div>

          <div class="flex justify-between border-t pt-4">
            <button
              type="button"
              @click="isEditing = false"
              class="rounded border px-4 py-2 text-sm"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="rounded bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {{ loading ? "Сохранение..." : "Сохранить изменения" }}
            </button>
          </div>
        </form>
      </div>

      <div v-else class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Username</label
            >
            <p class="mt-1 font-medium text-slate-800">{{ user?.username }}</p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Email</label
            >
            <p class="mt-1 font-medium text-slate-800">{{ user?.email }}</p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Имя</label
            >
            <p class="mt-1 font-medium text-slate-800">
              {{ user?.firstName || "—" }}
            </p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Фамилия</label
            >
            <p class="mt-1 font-medium text-slate-800">
              {{ user?.lastName || "—" }}
            </p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Номер телефона</label
            >
            <p class="mt-1 font-medium text-slate-800">
              {{ user?.phoneNumber || "Не указан" }}
            </p>
          </div>
          <div>
            <label class="text-xs uppercase tracking-wide text-slate-500"
              >Опыт работы</label
            >
            <p class="mt-1 font-medium text-slate-800">
              {{ formatExperience(user?.experience) }}
            </p>
          </div>
        </div>

        <div>
          <label class="text-xs uppercase tracking-wide text-slate-500"
            >Навыки</label
          >
          <div
            v-if="parsedSkills && parsedSkills.length > 0"
            class="mt-2 space-y-3"
          >
            <div v-for="(category, catIndex) in parsedSkills" :key="catIndex">
              <div class="text-sm text-slate-600 mb-2 font-medium">
                {{ category.categoryName }}
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(skill, skillIndex) in category.skills"
                  :key="skillIndex"
                  class="inline-flex items-center gap-1.5 rounded-full bg-accent-2/10 border border-accent-2/30 px-3 py-1.5 text-sm font-medium text-accent-2"
                >
                  {{ skill.name }}
                  <span
                    class="text-xs opacity-75"
                    :title="getLevelTitle(skill.level)"
                  >
                    {{ getLevelStars(skill.level) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <p v-else class="mt-1 text-slate-500">
            Не указаны
            <router-link
              to="/skills"
              class="ml-2 text-accent-2 hover:underline"
            >
              → Выбрать навыки
            </router-link>
          </p>
        </div>

        <div>
          <label class="text-xs uppercase tracking-wide text-slate-500"
            >Интересы</label
          >
          <p class="mt-1 whitespace-pre-wrap text-slate-800">
            {{ user?.interests || "Не указаны" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const auth = useAuth();
const { user, loading, error, updateProfile, getProfile, isAuthenticated } =
  auth;

// Ensure we load any saved auth data (token + user) from localStorage
auth.loadAuthFromStorage();

const isEditing = ref(false);
const initialLoading = ref(true);
const formError = ref<string | null>(null);
const formData = ref({
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  skills: "",
  interests: "",
  experience: "",
});

const categoryNames: Record<string, string> = {
  backend: "Backend",
  frontend: "Frontend",
  data: "Data Science",
  mobile: "Mobile Dev",
  devops: "DevOps",
  qa: "QA/Testing",
  ux: "UX/UI Design",
  cybersecurity: "Cybersecurity",
};

const parsedSkills = computed(() => {
  if (!user.value?.skills) return null;
  try {
    const data = JSON.parse(user.value.skills);

    // New format - array of categories
    if (Array.isArray(data)) {
      const allSkills: Array<{
        categoryId: string;
        categoryName: string;
        skills: Array<{ name: string; level: string }>;
      }> = [];

      data.forEach((categoryData: any) => {
        if (
          categoryData.category &&
          categoryData.skills &&
          Array.isArray(categoryData.skills)
        ) {
          allSkills.push({
            categoryId: categoryData.category,
            categoryName:
              categoryNames[categoryData.category] || categoryData.category,
            skills: categoryData.skills,
          });
        }
      });

      return allSkills.length > 0 ? allSkills : null;
    }

    // Old format - single category
    if (data.category && data.skills && Array.isArray(data.skills)) {
      return [
        {
          categoryId: data.category,
          categoryName: categoryNames[data.category] || data.category,
          skills: data.skills,
        },
      ];
    }
  } catch (e) {
    console.error("Failed to parse skills:", e);
  }
  return null;
});

const getLevelStars = (level: string) => {
  const map: Record<string, string> = {
    beginner: "★",
    intermediate: "★★",
    advanced: "★★★",
  };
  return map[level] || "★";
};

const getLevelTitle = (level: string) => {
  const map: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return map[level] || level;
};

const formatExperience = (exp?: string) => {
  const map: Record<string, string> = {
    no_experience: "Без опыта",
    less_than_1: "Менее 1 года",
    "1_to_3": "1-3 года",
    "3_to_5": "3-5 лет",
    "5_plus": "5+ лет",
  };
  return exp ? map[exp] || exp : "Не указано";
};

onMounted(async () => {
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    initialLoading.value = false;
    formError.value = "Для просмотра профиля необходимо войти в аккаунт";
    setTimeout(() => {
      router.push("/login");
    }, 1500);
    return;
  }

  try {
    // Try to refresh profile from server; if it fails, we still have local user
    await getProfile();
    if (user.value) {
      formData.value = {
        username: user.value.username || "",
        email: user.value.email || "",
        firstName: user.value.firstName || "",
        lastName: user.value.lastName || "",
        phoneNumber: user.value.phoneNumber || "",
        skills: user.value.skills || "",
        interests: user.value.interests || "",
        experience: user.value.experience || "",
      };
    }
  } catch (e: any) {
    // Если ошибка 401
    if (e?.status === 401) {
      formError.value = "Сессия истекла. Перенаправление на страницу входа...";
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  } finally {
    initialLoading.value = false;
  }
});

// When entering edit mode, populate formData from current user (local) immediately
watch(isEditing, (newVal) => {
  if (newVal) {
    const u = user.value;
    if (u) {
      formData.value = {
        username: u.username || "",
        email: u.email || "",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        phoneNumber: u.phoneNumber || "",
        skills: u.skills || "",
        interests: u.interests || "",
        experience: u.experience || "",
      };
    } else {
      // Fallback: read from localStorage directly
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          formData.value.email = parsed.email || "";
        }
      } catch {}
    }
  }
});

const handleSave = async () => {
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    formError.value = "Для сохранения изменений необходимо войти в аккаунт";
    setTimeout(() => {
      router.push("/login");
    }, 1500);
    return;
  }

  formError.value = null;
  try {
    await updateProfile(formData.value);
    isEditing.value = false;
  } catch (e: any) {
    // If 401 error (Unauthorized)
    if (e?.status === 401) {
      formError.value = "Сессия истекла. Перенаправление на страницу входа...";
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      formError.value = e?.message || "Не удалось сохранить изменения";
    }
  }
};
</script>
