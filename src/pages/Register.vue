<template>
  <div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
    <h2 class="text-xl font-medium">Регистрация</h2>

    <form @submit.prevent="handleSubmit" class="mt-4 space-y-3">
      <div>
        <label class="text-sm text-slate-600">Username (уникально)</label>
        <input
          v-model="form.username"
          type="text"
          class="mt-1 w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div>
        <label class="text-sm text-slate-600">E-mail</label>
        <input
          v-model="form.email"
          type="email"
          class="mt-1 w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div>
        <label class="text-sm text-slate-600">Пароль</label>
        <input
          v-model="form.password"
          type="password"
          class="mt-1 w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div v-if="error" class="rounded bg-red-50 p-3 text-sm text-red-700">
        {{ error.message }}
      </div>

      <div
        v-if="successMessage"
        class="rounded bg-green-50 p-4 text-sm text-green-700"
      >
        <p class="font-medium mb-2">✅ {{ successMessage }}</p>
        <p class="text-xs">Перенаправление на страницу входа...</p>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="rounded bg-accent px-4 py-2 text-white disabled:opacity-50"
        >
          {{ loading ? "Создание..." : "Создать аккаунт" }}
        </button>
      </div>

      <p class="text-center text-sm">
        Уже есть аккаунт?
        <router-link to="/login" class="text-accent-2 hover:underline"
          >Войти</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const router = useRouter();
const { register, loading, error } = useAuth();

const form = ref({
  username: "",
  email: "",
  password: "",
});

const successMessage = ref<string | null>(null);

const handleSubmit = async () => {
  try {
    const response = await register(form.value);
    if (response.success) {
      successMessage.value = response.message;
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  } catch {
    // Error is handled in useAuth
  }
};
</script>
