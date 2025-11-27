<template>
  <header class="sticky top-0 z-40 border-b bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-semibold text-accent">
          Career Navigator
        </router-link>
        <div class="hidden gap-6 md:flex">
          <router-link
            to="/"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Главная
          </router-link>
          <router-link
            v-if="auth.isAuthenticated.value"
            to="/profile"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Профиль
          </router-link>
          <router-link
            to="/skills"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Навыки
          </router-link>
          <router-link
            to="/recommendations"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Рекомендации
          </router-link>
          <router-link
            to="/mentors"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Менторы
          </router-link>
          <router-link
            to="/cases"
            class="text-sm text-slate-600 hover:text-slate-800"
          >
            Кейсы
          </router-link>
          <router-link
            v-if="auth.user.value?.role === 'ADMIN'"
            to="/admin"
            class="text-sm font-medium text-accent-2 hover:text-accent"
          >
            Админ-панель
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated.value">
          <router-link to="/profile" class="text-sm text-slate-700">
            {{ auth.userName.value }}
          </router-link>
          <button
            @click="handleLogout"
            class="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Войти
          </router-link>
          <router-link
            to="/register"
            class="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Регистрация
          </router-link>
        </template>
      </div>
    </nav>
  </header>

  <main class="mx-auto max-w-7xl px-4 py-8">
    <router-view />
  </main>

  <footer
    class="mt-12 border-t bg-slate-50 py-6 text-center text-sm text-slate-500"
  >
    &copy; {{ new Date().getFullYear() }} AI-based Career Navigator — MVP
  </footer>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const auth = useAuth();
auth.loadAuthFromStorage();

const handleLogout = () => {
  auth.logout();
  location.hash = "#/";
};
</script>
