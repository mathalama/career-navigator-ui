<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-slate-900">
        Управление пользователями
      </h2>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по имени, email..."
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2 focus:border-accent-2"
        />
        <select
          v-model="filterRole"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2 focus:border-accent-2"
        >
          <option value="">Все роли</option>
          <option value="USER">Пользователь</option>
          <option value="ADMIN">Администратор</option>
          <option value="MENTOR">Ментор</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2 focus:border-accent-2"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="verified">Верифицированные</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Пользователь
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Роль
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Статус
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Дата регистрации
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
            <td colspan="6" class="px-6 py-8 text-center text-slate-500">
              Загрузка...
            </td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-slate-500">
              Нет пользователей
            </td>
          </tr>
          <tr
            v-else
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-slate-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div
                    class="h-10 w-10 rounded-full bg-accent-2 flex items-center justify-center text-white font-medium"
                  >
                    {{ user.username.substring(0, 2).toUpperCase() }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-slate-900">
                    {{ user.username }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'MENTOR'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.verified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800',
                ]"
              >
                {{ user.verified ? "Верифицирован" : "Не верифицирован" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click="editUser(user)"
                class="text-accent-2 hover:text-accent-2/80 mr-3"
              >
                Редактировать
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow"
    >
      <div class="text-sm text-slate-700">
        Показано <span class="font-medium">{{ filteredUsers.length }}</span> из
        <span class="font-medium">{{ users.length }}</span> пользователей
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-slate-50">
          Предыдущая
        </button>
        <button class="px-3 py-1 bg-accent-2 text-white rounded">1</button>
        <button class="px-3 py-1 border rounded hover:bg-slate-50">2</button>
        <button class="px-3 py-1 border rounded hover:bg-slate-50">3</button>
        <button class="px-3 py-1 border rounded hover:bg-slate-50">
          Следующая
        </button>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{
            editingUser ? "Редактировать пользователя" : "Добавить пользователя"
          }}
        </h3>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              v-model="formData.username"
              type="text"
              required
              :disabled="!!editingUser"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              required
              :disabled="!!editingUser"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2 disabled:bg-slate-100"
            />
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Пароль
            </label>
            <input
              v-model="formData.password"
              type="password"
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Роль
            </label>
            <select
              v-model="formData.role"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-2"
            >
              <option value="USER">Пользователь</option>
              <option value="ADMIN">Администратор</option>
              <option value="MENTOR">Ментор</option>
            </select>
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
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verified?: boolean;
  createdAt?: string;
}

const searchQuery = ref("");
const filterRole = ref("");
const filterStatus = ref("");
const showAddModal = ref(false);
const editingUser = ref<User | null>(null);
const loading = ref(false);

const formData = ref({
  username: "",
  email: "",
  password: "",
  role: "USER",
});

const users = ref<User[]>([]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api["client"].get("/admin/users");
    users.value = response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (user.firstName?.toLowerCase() || "").includes(
        searchQuery.value.toLowerCase()
      ) ||
      (user.lastName?.toLowerCase() || "").includes(
        searchQuery.value.toLowerCase()
      );

    const matchesRole = !filterRole.value || user.role === filterRole.value;

    const matchesStatus =
      !filterStatus.value ||
      (filterStatus.value === "verified" && user.verified) ||
      (filterStatus.value === "active" && user.verified);

    return matchesSearch && matchesRole && matchesStatus;
  });
});

const formatDate = (date?: string) => {
  if (!date) return "Неизвестно";
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const editUser = (user: User) => {
  editingUser.value = user;
  formData.value = {
    username: user.username,
    email: user.email,
    role: user.role,
  };
  showAddModal.value = true;
};

const saveUser = async () => {
  if (editingUser.value && editingUser.value.id) {
    try {
      await api["client"].put(
        `/admin/users/${editingUser.value.id}/role`,
        null,
        { params: { role: formData.value.role } }
      );
      await fetchUsers();
      showAddModal.value = false;
      editingUser.value = null;
      formData.value = { username: "", email: "", password: "", role: "USER" };
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Ошибка при обновлении пользователя");
    }
  } else {
    try {
      await api["client"].post("/auth/register", {
        username: formData.value.username,
        email: formData.value.email,
        password: formData.value.password,
      });
      if (formData.value.role !== "USER") {
        const response = await api["client"].get("/admin/users");
        const newUser = response.data.find(
          (u: User) => u.username === formData.value.username
        );
        if (newUser) {
          await api["client"].put(`/admin/users/${newUser.id}/role`, null, {
            params: { role: formData.value.role },
          });
        }
      }
      await fetchUsers();
      showAddModal.value = false;
      formData.value = { username: "", email: "", password: "", role: "USER" };
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Ошибка при создании пользователя");
    }
  }
};

const deleteUser = async (id?: number) => {
  if (!id) return;
  if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
    try {
      await api["client"].delete(`/admin/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Ошибка при удалении пользователя");
    }
  }
};
</script>
