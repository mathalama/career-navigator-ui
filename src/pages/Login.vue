<template>
  <div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
    <h2 class="text-xl font-medium">Вход</h2>

    <form @submit.prevent="handleSubmit" class="mt-4 space-y-3">
      <div>
        <label class="text-sm text-slate-600">E-mail или Username</label>
        <input
          v-model="form.identifier"
          type="text"
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

      <div class="flex items-center justify-between">
        <router-link
          to="/register"
          class="text-sm text-accent-2 hover:underline"
        >
          Зарегистрироваться
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="rounded bg-accent px-4 py-2 text-white disabled:opacity-50"
        >
          {{ loading ? "Вход..." : "Войти" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const router = useRouter();
const { login, loading, error } = useAuth();

const form = ref({
  identifier: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    await login(form.value);
    router.push("/profile");
  } catch {
    // Error is handled in useAuth
  }
};
</script>
