<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <h1 class="text-2xl font-bold text-slate-900">
            Административная панель
          </h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-600">{{ user?.username }}</span>
            <button
              @click="logout"
              class="text-sm text-slate-600 hover:text-slate-900"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav class="flex gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-accent-2 text-accent-2'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'">
        <AnalyticsPanel />
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'">
        <UsersPanel />
      </div>

      <!-- Mentors Tab -->
      <div v-if="activeTab === 'mentors'">
        <MentorsPanel />
      </div>

      <!-- Companies Tab -->
      <div v-if="activeTab === 'companies'">
        <CompaniesPanel />
      </div>

      <!-- Jobs Tab -->
      <div v-if="activeTab === 'jobs'">
        <JobsPanel />
      </div>

      <!-- Cases Tab -->
      <div v-if="activeTab === 'cases'">
        <CasesPanel />
      </div>

      <!-- Courses Tab -->
      <div v-if="activeTab === 'courses'">
        <CoursesPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel.vue";
import UsersPanel from "@/components/admin/UsersPanel.vue";
import MentorsPanel from "@/components/admin/MentorsPanel.vue";
import CompaniesPanel from "@/components/admin/CompaniesPanel.vue";
import JobsPanel from "@/components/admin/JobsPanel.vue";
import CasesPanel from "@/components/admin/CasesPanel.vue";
import CoursesPanel from "@/components/admin/CoursesPanel.vue";

const router = useRouter();
const { user, logout: authLogout } = useAuth();

const tabs = [
  { id: "analytics", name: "Аналитика" },
  { id: "users", name: "Пользователи" },
  { id: "mentors", name: "Менторы" },
  { id: "companies", name: "Компании" },
  { id: "jobs", name: "Вакансии" },
  { id: "cases", name: "Кейсы" },
  { id: "courses", name: "Курсы" },
];

const activeTab = ref("analytics");

const logout = () => {
  authLogout();
  router.push("/login");
};

onMounted(() => {
  // Check admin permissions
  if (user.value?.role !== "ADMIN") {
    router.push("/");
  }
});
</script>
