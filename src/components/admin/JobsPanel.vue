<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">
        Управление вакансиями
      </h2>
      <button
        @click="showAddModal = true"
        class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
      >
        + Добавить вакансию
      </button>
    </div>

    <!-- Jobs Table -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Вакансия
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Компания
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Локация
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Технологии
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Загрузка...
            </td>
          </tr>
          <tr v-else-if="jobs.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Нет вакансий
            </td>
          </tr>
          <tr v-else v-for="job in jobs" :key="job.id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-slate-900">{{ job.title }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-900">{{ job.company }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">{{ job.location }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in job.tags?.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 text-xs border border-slate-900 text-slate-900 rounded"
                >
                  {{ tag }}
                </span>
                <span v-if="job.tags?.length > 3" class="px-2 py-1 text-xs text-slate-500">
                  +{{ job.tags.length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click="editJob(job)"
                class="text-slate-600 hover:text-slate-900 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteJob(job.id)"
                class="text-red-600 hover:text-red-900"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold mb-4">
          {{ editingJob ? "Редактировать вакансию" : "Добавить вакансию" }}
        </h3>
        <form @submit.prevent="saveJob" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Название должности
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Компания
            </label>
            <input
              v-model="formData.company"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Город
              </label>
              <input
                v-model="formData.location"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Зарплата
              </label>
              <input
                v-model="formData.salary"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              График работы
            </label>
            <select
              v-model="formData.schedule"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Полный день">Полный день</option>
              <option value="Гибкий график">Гибкий график</option>
              <option value="Удаленная работа">Удаленная работа</option>
              <option value="Сменный график">Сменный график</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Описание
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              required
              class="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Теги (через запятую)
            </label>
            <input
              v-model="formData.tagsInput"
              type="text"
              placeholder="Java, Spring, PostgreSQL"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 border rounded-lg hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-accent-2 text-white rounded-lg hover:bg-accent-2/90"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

interface Job {
  id?: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  schedule?: string;
  description?: string;
  tags: string[];
}

const showAddModal = ref(false);
const editingJob = ref<Job | null>(null);
const loading = ref(false);

const formData = ref({
  title: "",
  company: "",
  location: "",
  salary: "",
  schedule: "Полный день",
  description: "",
  tagsInput: "",
});

const jobs = ref<Job[]>([]);

const fetchJobs = async () => {
  loading.value = true;
  try {
    const response = await api['client'].get("/admin/jobs");
    jobs.value = response.data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchJobs();
});

const editJob = (job: Job) => {
  editingJob.value = job;
  formData.value = {
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary || "",
    schedule: job.schedule || "Полный день",
    description: job.description || "",
    tagsInput: job.tags.join(", "),
  };
  showAddModal.value = true;
};

const saveJob = async () => {
  const tags = formData.value.tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);

  const jobData = {
    title: formData.value.title,
    company: formData.value.company,
    location: formData.value.location,
    tags,
  };

  try {
    if (editingJob.value) {
      await api['client'].put(`/admin/jobs/${editingJob.value.id}`, jobData);
    } else {
      await api['client'].post("/admin/jobs", jobData);
    }
    await fetchJobs();
    showAddModal.value = false;
    editingJob.value = null;
    formData.value = {
      title: "",
      company: "",
      location: "",
      salary: "",
      schedule: "Полный день",
      description: "",
      tagsInput: "",
    };
  } catch (error) {
    console.error("Failed to save job:", error);
    alert("Ошибка при сохранении вакансии");
  }
};

const deleteJob = async (id?: number) => {
  if (!id) return;
  if (confirm("Удалить эту вакансию?")) {
    try {
      await api['client'].delete(`/admin/jobs/${id}`);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Ошибка при удалении вакансии");
    }
  }
};
</script>
