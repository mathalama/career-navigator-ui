<template>
  <div>
    <h2 class="mb-4 text-lg font-medium">Менторы</h2>
    <div v-if="loading" class="text-slate-500">Загрузка менторов...</div>
    <div v-else-if="mentors.length" class="grid gap-4 md:grid-cols-3">
      <div
        v-for="mentor in mentors"
        :key="mentor.id || mentor.name"
        class="rounded-lg bg-white p-4 shadow-sm"
      >
        <h4 class="font-semibold">{{ mentor.name }}</h4>
        <p class="text-sm text-slate-600">{{ mentor.role }}</p>
        <p class="mt-2 text-sm text-slate-700">{{ mentor.area }}</p>
        <div class="mt-4 flex items-center justify-between">
          <button class="rounded bg-accent px-3 py-1 text-sm text-white">
            Записаться
          </button>
          <button
            @click="openReviews(mentor.id)"
            class="text-sm text-slate-600 hover:text-slate-900"
          >
            Отзывы
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-slate-500">Нет менторов</div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/composables/useApi";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { mentors, loading, fetchMentors } = useApi();
const router = useRouter();

onMounted(() => {
  fetchMentors();
});

const openReviews = (mentorId: number) => {
  router.push(`/mentors/${mentorId}/reviews`);
};
</script>
