<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">
        Управление компаниями
      </h2>
      <button
        @click="showAddModal = true"
        class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
      >
        + Добавить компанию
      </button>
    </div>

    <!-- Companies Table -->
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
              Отрасль
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Локация
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Сотрудников
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
          <tr v-else-if="companies.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Нет компаний
            </td>
          </tr>
          <tr
            v-else
            v-for="company in companies"
            :key="company.id"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-slate-900">
                {{ company.name }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-900">{{ company.industry }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">{{ company.location }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">
                {{ company.employees }}
              </div>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click="editCompany(company)"
                class="text-slate-600 hover:text-slate-900 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteCompany(company.id)"
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
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold mb-4">
          {{ editingCompany ? "Редактировать компанию" : "Добавить компанию" }}
        </h3>
        <form @submit.prevent="saveCompany" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Название
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
              Отрасль
            </label>
            <input
              v-model="formData.industry"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Локация
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
              Количество сотрудников
            </label>
            <input
              v-model.number="formData.employees"
              type="number"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
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

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  description: string;
}

const showAddModal = ref(false);
const editingCompany = ref<Company | null>(null);
const loading = ref(false);

const formData = ref({
  name: "",
  industry: "",
  location: "",
  employees: 0,
  description: "",
});

const companies = ref<Company[]>([]);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await api["client"].get("/admin/companies");
    companies.value = response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
  } finally {
    loading.value = false;
  }
};

const editCompany = (company: Company) => {
  editingCompany.value = company;
  formData.value = {
    name: company.name,
    industry: company.industry,
    location: company.location,
    employees: company.employees,
    description: company.description,
  };
  showAddModal.value = true;
};

const saveCompany = async () => {
  try {
    if (editingCompany.value) {
      await api["client"].put(
        `/admin/companies/${editingCompany.value.id}`,
        formData.value
      );
    } else {
      await api["client"].post("/admin/companies", formData.value);
    }
    await fetchData();
    showAddModal.value = false;
    editingCompany.value = null;
    formData.value = {
      name: "",
      industry: "",
      location: "",
      employees: 0,
      description: "",
    };
  } catch (error) {
    console.error("Failed to save company:", error);
  }
};

const deleteCompany = async (id: number) => {
  if (confirm("Удалить эту компанию?")) {
    try {
      await api["client"].delete(`/admin/companies/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
