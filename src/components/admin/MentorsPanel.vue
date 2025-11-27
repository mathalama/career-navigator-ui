<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">Управление менторами</h2>
      <button
        @click="showAddModal = true"
        class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
      >
        + Добавить ментора
      </button>
    </div>

    <!-- Mentors Table -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Ментор
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Должность
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Специализация
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-8 text-center text-slate-500">
              Загрузка...
            </td>
          </tr>
          <tr v-else-if="mentors.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-slate-500">
              Нет менторов
            </td>
          </tr>
          <tr
            v-else
            v-for="mentor in mentors"
            :key="mentor.id"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-slate-900 font-medium text-sm"
                  >
                    {{ mentor.name.substring(0, 2).toUpperCase() }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-slate-900">
                    {{ mentor.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-900">{{ mentor.role }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">{{ mentor.area }}</div>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click="editMentor(mentor)"
                class="text-slate-600 hover:text-slate-900 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteMentor(mentor.id)"
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
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingMentor ? "Редактировать ментора" : "Добавить ментора" }}
        </h3>
        <form @submit.prevent="saveMentor" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Имя
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Должность
            </label>
            <input
              v-model="formData.role"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Специализация
            </label>
            <input
              v-model="formData.area"
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
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Опыт (лет)
            </label>
            <input
              v-model="formData.experience"
              type="number"
              required
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

interface Mentor {
  id?: number;
  name: string;
  role: string;
  area: string;
  company?: string;
  experience?: number;
}

const showAddModal = ref(false);
const editingMentor = ref<Mentor | null>(null);
const loading = ref(false);

const formData = ref({
  name: "",
  role: "",
  area: "",
  company: "",
  experience: 5,
});

const mentors = ref<Mentor[]>([]);

const fetchMentors = async () => {
  loading.value = true;
  try {
    const response = await api["client"].get("/admin/mentors");
    mentors.value = response.data;
  } catch (error) {
    console.error("Failed to fetch mentors:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMentors();
});

const editMentor = (mentor: Mentor) => {
  editingMentor.value = mentor;
  formData.value = {
    name: mentor.name,
    role: mentor.role,
    area: mentor.area,
    company: mentor.company || "",
    experience: mentor.experience || 5,
  };
  showAddModal.value = true;
};

const saveMentor = async () => {
  const mentorData = {
    name: formData.value.name,
    role: formData.value.role,
    area: formData.value.area,
  };

  try {
    if (editingMentor.value) {
      await api["client"].put(
        `/admin/mentors/${editingMentor.value.id}`,
        mentorData
      );
    } else {
      await api["client"].post("/admin/mentors", mentorData);
    }

    await fetchMentors();
    showAddModal.value = false;
    editingMentor.value = null;
    formData.value = {
      name: "",
      role: "",
      area: "",
      company: "",
      experience: 5,
    };
  } catch (error) {
    console.error("Failed to save mentor:", error);
    alert("Ошибка при сохранении ментора");
  }
};

const deleteMentor = async (id?: number) => {
  if (!id) return;
  if (confirm("Удалить этого ментора?")) {
    try {
      await api["client"].delete(`/admin/mentors/${id}`);
      await fetchMentors();
    } catch (error) {
      console.error("Failed to delete mentor:", error);
      alert("Ошибка при удалении ментора");
    }
  }
};
</script>
