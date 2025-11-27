<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">Управление курсами</h2>
      <button
        @click="showAddModal = true"
        class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
      >
        + Добавить курс
      </button>
    </div>

    <!-- Courses Table -->
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
              Уровень
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
          <tr v-else-if="courses.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              Нет курсов
            </td>
          </tr>
          <tr
            v-else
            v-for="course in courses"
            :key="course.id"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-slate-900">
                {{ course.title }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-900">{{ course.category }}</div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs border border-slate-900 text-slate-900 rounded"
              >
                {{ course.level }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-slate-500">{{ course.duration }}</div>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                @click="editCourse(course)"
                class="text-slate-600 hover:text-slate-900 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteCourse(course.id)"
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
          {{ editingCourse ? "Редактировать курс" : "Добавить курс" }}
        </h3>
        <form @submit.prevent="saveCourse" class="space-y-4">
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
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Уровень
              </label>
              <select
                v-model="formData.level"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Длительность
              </label>
              <input
                v-model="formData.duration"
                type="text"
                placeholder="8 недель"
                required
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Количество уроков
              </label>
              <input
                v-model="formData.lessons"
                type="number"
                required
                class="w-full px-3 py-2 border rounded-lg"
              />
            </div>
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
              Программа курса
            </label>
            <textarea
              v-model="formData.syllabus"
              rows="6"
              placeholder="Неделя 1: Введение&#10;Неделя 2: Основы..."
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

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  studentsCount: number;
  description: string;
  syllabus: string;
}

const showAddModal = ref(false);
const editingCourse = ref<Course | null>(null);
const loading = ref(false);

const formData = ref({
  title: "",
  category: "Backend",
  level: "Beginner",
  duration: "",
  lessons: 10,
  studentsCount: 0,
  description: "",
  syllabus: "",
});

const courses = ref<Course[]>([]);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await api["client"].get("/admin/courses");
    courses.value = response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  } finally {
    loading.value = false;
  }
};

const editCourse = (course: Course) => {
  editingCourse.value = course;
  formData.value = { ...course };
  showAddModal.value = true;
};

const saveCourse = async () => {
  try {
    if (editingCourse.value) {
      await api["client"].put(
        `/admin/courses/${editingCourse.value.id}`,
        formData.value
      );
    } else {
      await api["client"].post("/admin/courses", formData.value);
    }
    await fetchData();
    showAddModal.value = false;
    editingCourse.value = null;
    formData.value = {
      title: "",
      category: "Backend",
      level: "Beginner",
      duration: "",
      lessons: 10,
      studentsCount: 0,
      description: "",
      syllabus: "",
    };
  } catch (error) {
    console.error("Failed to save course:", error);
  }
};

const deleteCourse = async (id: number) => {
  if (confirm("Удалить этот курс?")) {
    try {
      await api["client"].delete(`/admin/courses/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
