<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-slate-900">Управление контентом</h2>

    <!-- Content Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button
        v-for="category in contentCategories"
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="[
          'p-6 rounded-lg border-2 transition-all text-left',
          selectedCategory === category.id
            ? 'border-accent-2 bg-accent-2/5'
            : 'border-slate-200 hover:border-accent-2/50',
        ]"
      >
        <div class="text-3xl mb-2">{{ category.icon }}</div>
        <h3 class="font-medium text-slate-900">{{ category.name }}</h3>
        <p class="text-sm text-slate-500 mt-1">
          {{ category.count }} элементов
        </p>
      </button>
    </div>

    <!-- Articles Section -->
    <div
      v-if="selectedCategory === 'articles'"
      class="bg-white rounded-lg shadow p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Статьи и блоги</h3>
        <button
          class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
        >
          + Добавить статью
        </button>
      </div>
      <div class="space-y-4">
        <div
          v-for="article in articles"
          :key="article.id"
          class="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50"
        >
          <div class="flex-1">
            <h4 class="font-medium text-slate-900">{{ article.title }}</h4>
            <p class="text-sm text-slate-600 mt-1">{{ article.excerpt }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span>{{ article.author }}</span>
              <span>{{ article.date }}</span>
              <span>{{ article.views }} просмотров</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="text-sm text-accent-2 hover:underline">
              Редактировать
            </button>
            <button class="text-sm text-red-600 hover:underline">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <div
      v-if="selectedCategory === 'resources'"
      class="bg-white rounded-lg shadow p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Ресурсы и материалы</h3>
        <button
          class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
        >
          + Добавить ресурс
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="resource in resources"
          :key="resource.id"
          class="p-4 border rounded-lg hover:bg-slate-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-slate-900">{{ resource.title }}</h4>
              <p class="text-sm text-slate-600 mt-1">
                {{ resource.description }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span
                  class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                >
                  {{ resource.type }}
                </span>
                <span class="text-xs text-slate-500">{{
                  resource.category
                }}</span>
              </div>
            </div>
            <button class="ml-4 text-sm text-accent-2 hover:underline">
              Изменить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Videos Section -->
    <div
      v-if="selectedCategory === 'videos'"
      class="bg-white rounded-lg shadow p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Видео-материалы</h3>
        <button
          class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
        >
          + Добавить видео
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="video in videos"
          :key="video.id"
          class="rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
        >
          <div class="h-32 bg-slate-200 flex items-center justify-center">
            <span class="text-4xl">🎥</span>
          </div>
          <div class="p-4">
            <h4 class="font-medium text-slate-900 mb-1">{{ video.title }}</h4>
            <p class="text-sm text-slate-600 mb-2">{{ video.duration }}</p>
            <div class="flex justify-between text-xs text-slate-500">
              <span>{{ video.views }} просмотров</span>
              <span>{{ video.likes }} ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQs Section -->
    <div
      v-if="selectedCategory === 'faq'"
      class="bg-white rounded-lg shadow p-6"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Часто задаваемые вопросы</h3>
        <button
          class="bg-accent-2 text-white px-4 py-2 rounded-lg hover:bg-accent-2/90"
        >
          + Добавить вопрос
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="faq in faqs"
          :key="faq.id"
          class="p-4 border rounded-lg hover:bg-slate-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-slate-900">{{ faq.question }}</h4>
              <p class="text-sm text-slate-600 mt-2">{{ faq.answer }}</p>
              <span class="text-xs text-slate-500 mt-2 inline-block">
                Категория: {{ faq.category }}
              </span>
            </div>
            <div class="flex gap-2 ml-4">
              <button class="text-sm text-accent-2 hover:underline">
                Изменить
              </button>
              <button class="text-sm text-red-600 hover:underline">
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedCategory = ref("articles");

const contentCategories = [
  { id: "articles", name: "Статьи", icon: "📝", count: 45 },
  { id: "resources", name: "Ресурсы", icon: "📚", count: 78 },
  { id: "videos", name: "Видео", icon: "🎥", count: 23 },
  { id: "faq", name: "FAQ", icon: "❓", count: 34 },
];

const articles = ref([
  {
    id: 1,
    title: "Как подготовиться к собеседованию на Backend Developer",
    excerpt: "Полное руководство по подготовке к техническому интервью...",
    author: "Иван Петров",
    date: "15 ноя 2024",
    views: 1234,
  },
  {
    id: 2,
    title: "Тренды в Data Science 2024",
    excerpt: "Обзор самых актуальных технологий и подходов в анализе данных...",
    author: "Мария Иванова",
    date: "12 ноя 2024",
    views: 856,
  },
]);

const resources = ref([
  {
    id: 1,
    title: "Шпаргалка по Git",
    description: "Все основные команды Git в одном месте",
    type: "PDF",
    category: "DevOps",
  },
  {
    id: 2,
    title: "Паттерны проектирования",
    description: "Классические паттерны с примерами на Java",
    type: "Статья",
    category: "Backend",
  },
]);

const videos = ref([
  {
    id: 1,
    title: "Введение в Spring Boot",
    duration: "45:23",
    views: 2134,
    likes: 234,
  },
  {
    id: 2,
    title: "React Hooks в деталях",
    duration: "32:15",
    views: 1567,
    likes: 189,
  },
  {
    id: 3,
    title: "Docker для начинающих",
    duration: "28:47",
    views: 3421,
    likes: 456,
  },
]);

const faqs = ref([
  {
    id: 1,
    question: "Как зарегистрироваться на платформе?",
    answer:
      "Нажмите кнопку 'Регистрация' в правом верхнем углу и заполните форму...",
    category: "Общие",
  },
  {
    id: 2,
    question: "Как найти ментора?",
    answer:
      "Перейдите в раздел 'Менторы', используйте фильтры по специализации...",
    category: "Менторство",
  },
  {
    id: 3,
    question: "Как откликнуться на вакансию?",
    answer: "Откройте интересующую вакансию и нажмите кнопку 'Откликнуться'...",
    category: "Вакансии",
  },
]);
</script>
