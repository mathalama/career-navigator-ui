<template>
  <div>
    <h2 class="mb-4 text-lg font-medium">Кейсы от индустрии</h2>
    <div v-if="loading" class="text-slate-500">Загрузка кейсов...</div>
    <div v-else-if="cases.length" class="space-y-4">
      <div
        v-for="caseItem in cases"
        :key="caseItem.id || caseItem.title"
        class="flex items-start justify-between rounded-lg bg-white p-4 shadow-sm"
      >
        <div>
          <h4 class="font-semibold">{{ caseItem.title }}</h4>
          <p class="text-sm text-slate-600">
            {{ caseItem.company }} — сложность: {{ caseItem.difficulty }}
          </p>
        </div>
        <button class="rounded border px-3 py-1 text-sm">Подать заявку</button>
      </div>
    </div>
    <div v-else class="text-slate-500">Нет кейсов</div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "@/composables/useApi";
import { onMounted } from "vue";

const { cases, loading, fetchCases } = useApi();

onMounted(() => {
  fetchCases();
});
</script>
