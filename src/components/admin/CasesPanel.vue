<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">Управление кейсами</h2>
      <button
        @click="showAddModal = true"
        class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
      >
        + Добавить кейс
      </button>
    </div>

    <!-- Cases Table -->
    <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Название
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Категория
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Сложность
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Длительность
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
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Загрузка...
            </td>
          </tr>
          <tr v-else-if="cases.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Нет кейсов
            </td>
          </tr>
          <tr
            v-else
            v-for="caseItem in cases"
            :key="caseItem.id"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-slate-900">
                {{ caseItem.title }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-900">
                {{ caseItem.category }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded',
                  caseItem.difficulty === 'JUNIOR'
                    ? 'bg-green-100 text-green-800'
                    : caseItem.difficulty === 'MIDDLE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ caseItem.difficulty }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">
                {{ caseItem.duration }}
              </div>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click="editCase(caseItem)"
                class="text-slate-600 hover:text-slate-900 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteCase(caseItem.id)"
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
          {{ editingCase ? "Редактировать кейс" : "Добавить кейс" }}
        </h3>
        <form @submit.prevent="saveCase" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Название
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Сложность
              </label>
              <select
                v-model="formData.difficulty"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="JUNIOR">JUNIOR</option>
                <option value="MIDDLE">MIDDLE</option>
                <option value="SENIOR">SENIOR</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Длительность
              </label>
              <input
                v-model="formData.duration"
                type="text"
                placeholder="30-60 минут"
                required
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Категория
            </label>
            <select
              v-model="formData.category"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
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
              Задание
            </label>
            <textarea
              v-model="formData.task"
              rows="6"
              placeholder="Подробное описание задания..."
              required
              class="w-full px-3 py-2 border rounded-lg"
            ></textarea>
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
import api from "../../services/api";

interface Case {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  duration: string;
  description: string;
  task: string;
}

const showAddModal = ref(false);
const editingCase = ref<Case | null>(null);
const loading = ref(false);

const formData = ref({
  title: "",
  difficulty: "JUNIOR",
  category: "Backend",
  duration: "",
  description: "",
  task: "",
});

const cases = ref<Case[]>([]);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await api["client"].get("/admin/cases");
    cases.value = response.data;
  } catch (error) {
    console.error("Failed to fetch cases:", error);
  } finally {
    loading.value = false;
  }
};

const editCase = (caseItem: Case) => {
  editingCase.value = caseItem;
  formData.value = { ...caseItem };
  showAddModal.value = true;
};

const saveCase = async () => {
  try {
    if (editingCase.value) {
      await api["client"].put(
        `/admin/cases/${editingCase.value.id}`,
        formData.value
      );
    } else {
      await api["client"].post("/admin/cases", formData.value);
    }
    await fetchData();
    showAddModal.value = false;
    editingCase.value = null;
    formData.value = {
      title: "",
      difficulty: "JUNIOR",
      category: "Backend",
      duration: "",
      description: "",
      task: "",
    };
  } catch (error) {
    console.error("Failed to save case:", error);
  }
};

const deleteCase = async (id: number) => {
  if (confirm("Удалить этот кейс?")) {
    try {
      await api["client"].delete(`/admin/cases/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete case:", error);
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
