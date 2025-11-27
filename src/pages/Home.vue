<template>
  <div class="space-y-8">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-slate-800">
        Добро пожаловать в Career Navigator
      </h1>
      <p class="mt-2 text-slate-600">
        Интеллектуальная платформа для построения персональной карьерной
        траектории.
      </p>
      <div class="mt-4 flex gap-3">
        <router-link
          to="/skills"
          class="rounded-md bg-accent px-4 py-2 text-white"
        >
          Пройти тест навыков
        </router-link>
        <router-link to="/recommendations" class="rounded-md border px-4 py-2">
          Посмотреть рекомендации
        </router-link>
      </div>
    </section>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-medium">Актуальные вакансии из HeadHunter</h2>
        <span v-if="vacanciesTotal" class="text-sm text-slate-500">
          Найдено: {{ vacanciesTotal }}
        </span>
      </div>

      <!-- Поиск и фильтры -->
      <div class="mb-4 space-y-3">
        <input
          v-model="searchText"
          @keyup.enter="searchVacancies"
          type="text"
          placeholder="Поиск вакансий (например: Java developer)"
          class="w-full rounded border px-4 py-2"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Опыт работы
            </label>
            <select
              v-model="filters.experience"
              @change="searchVacancies"
              class="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Не имеет значения</option>
              <option value="noExperience">Нет опыта</option>
              <option value="between1And3">1-3 года</option>
              <option value="between3And6">3-6 лет</option>
              <option value="moreThan6">Более 6 лет</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              График работы
            </label>
            <select
              v-model="filters.schedule"
              @change="searchVacancies"
              class="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">Любой</option>
              <option value="fullDay">Полный день</option>
              <option value="shift">Сменный график</option>
              <option value="flexible">Гибкий график</option>
              <option value="remote">Удаленная работа</option>
              <option value="flyInFlyOut">Вахтовый метод</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Зарплата
            </label>
            <div class="flex items-center h-10">
              <input
                v-model="filters.only_with_salary"
                @change="searchVacancies"
                type="checkbox"
                id="salary-checkbox"
                class="mr-2 h-4 w-4"
              />
              <label for="salary-checkbox" class="text-sm text-slate-700">
                Только с указанием зарплаты
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-slate-500">Загрузка вакансий...</div>
      <div v-else-if="error" class="rounded bg-red-50 p-4 text-red-700">
        {{ error.message }}
      </div>
      <div
        v-else-if="vacancies.length"
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="vacancy in vacancies"
          :key="vacancy.id"
          class="rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="font-semibold text-slate-800">{{ vacancy.name }}</h3>
          <p class="text-sm text-slate-600">
            {{ vacancy.employer.name }} — {{ vacancy.area.name }}
          </p>

          <div
            v-if="vacancy.salary"
            class="mt-2 text-sm font-medium text-green-600"
          >
            <span v-if="vacancy.salary.from"
              >от {{ formatSalary(vacancy.salary.from) }}</span
            >
            <span v-if="vacancy.salary.to">
              до {{ formatSalary(vacancy.salary.to) }}</span
            >
            {{ vacancy.salary.currency }}
          </div>

          <div v-if="vacancy.snippet" class="mt-3 text-sm text-slate-600">
            <p
              v-if="vacancy.snippet.requirement"
              class="line-clamp-2"
              v-html="vacancy.snippet.requirement"
            ></p>
          </div>

          <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span v-if="vacancy.experience">{{ vacancy.experience.name }}</span>
            <span v-if="vacancy.schedule">{{ vacancy.schedule.name }}</span>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <a
              :href="vacancy.alternate_url"
              target="_blank"
              class="text-sm text-accent-2 hover:underline"
            >
              Подробнее →
            </a>
            <span class="text-xs text-slate-400">
              {{ formatDate(vacancy.published_at) }}
            </span>
          </div>
        </article>
      </div>
      <div v-else class="text-slate-500">
        Введите запрос для поиска вакансий
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/composables/useApi";
import { onMounted, ref } from "vue";

const { vacancies, vacanciesTotal, loading, error, fetchVacancies } = useApi();
const searchText = ref("Java developer");
const filters = ref({
  experience: "",
  schedule: "",
  only_with_salary: false,
});

const searchVacancies = () => {
  fetchVacancies({
    text: searchText.value,
    per_page: 12,
    experience: filters.value.experience || undefined,
    schedule: filters.value.schedule || undefined,
    only_with_salary: filters.value.only_with_salary || undefined,
  });
};

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat("ru-RU").format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString("ru-RU");
};

onMounted(() => {
  searchVacancies();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
