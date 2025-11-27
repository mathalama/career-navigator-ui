<template>
  <div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-sm text-center">
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-accent-2"></div>
      <p class="text-slate-600">Проверяем ваш email...</p>
    </div>

    <div v-else-if="success" class="space-y-4">
      <div class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-slate-800">Email подтвержден!</h2>
      <p class="text-slate-600">{{ message }}</p>
      <router-link 
        to="/login"
        class="inline-block mt-4 rounded-md bg-accent-2 px-6 py-2 text-white hover:bg-accent-2/90"
      >
        Войти в аккаунт
      </router-link>
    </div>

    <div v-else-if="error" class="space-y-4">
      <div class="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-slate-800">Ошибка верификации</h2>
      <p class="text-red-600">{{ error }}</p>
      <router-link 
        to="/login"
        class="inline-block mt-4 rounded-md border border-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-50"
      >
        Вернуться на страницу входа
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const loading = ref(true);
const success = ref(false);
const error = ref("");
const message = ref("");

onMounted(async () => {
  const token = route.query.token as string;
  
  if (!token) {
    error.value = "Отсутствует токен верификации";
    loading.value = false;
    return;
  }

  try {
    const response = await api.verifyEmail(token);
    if (response.success) {
      success.value = true;
      message.value = response.message || "Теперь вы можете войти в систему";
    } else {
      error.value = response.error || "Неизвестная ошибка";
    }
  } catch (err: any) {
    error.value = err.message || "Не удалось подтвердить email";
  } finally {
    loading.value = false;
  }
});
</script>
