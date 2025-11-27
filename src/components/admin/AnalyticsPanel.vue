<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-slate-900">Аналитика и статистика</h2>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white border border-slate-200 rounded-lg"
      >
        <div class="p-5">
          <div>
            <dt class="text-sm font-medium text-slate-500 mb-2">
              {{ stat.name }}
            </dt>
            <dd class="text-2xl font-bold text-slate-900">
              {{ stat.value }}
            </dd>
          </div>
        </div>
        <div class="border-t border-slate-200 px-5 py-3">
          <div class="text-sm text-slate-600">
            <span class="font-medium">
              {{ stat.change > 0 ? "+" : "" }}{{ stat.change }}%
            </span>
            <span> за последний месяц</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Charts -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Visitors Chart -->
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-slate-900 mb-4">
          Посещаемость (последние 30 дней)
        </h3>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(day, index) in visitorsChart"
            :key="index"
            class="flex-1 bg-slate-900 rounded-t hover:bg-slate-700 transition-colors cursor-pointer"
            :style="{ height: (day / Math.max(...visitorsChart)) * 100 + '%' }"
            :title="`День ${index + 1}: ${day} посещений`"
          ></div>
        </div>
      </div>

      <!-- Activity Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-slate-900 mb-4">
          Активность пользователей
        </h3>
        <div class="space-y-4">
          <div v-for="activity in activityData" :key="activity.name">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600">{{ activity.name }}</span>
              <span class="font-medium text-slate-900">{{
                activity.value
              }}</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="bg-accent-2 h-2 rounded-full"
                :style="{ width: activity.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-slate-200">
        <h3 class="text-lg font-medium text-slate-900">Последняя активность</h3>
      </div>
      <div class="px-6 py-8">
        <p class="text-sm text-slate-500 text-center">Нет активности</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

const stats = ref([
  {
    name: "Всего пользователей",
    value: "0",
    change: 0,
  },
  {
    name: "Активные сегодня",
    value: "0",
    change: 0,
  },
  {
    name: "Вакансий",
    value: "0",
    change: 0,
  },
  {
    name: "Менторов",
    value: "0",
    change: 0,
  },
]);

const visitorsChart = ref<number[]>([]);

const activityData = ref([
  { name: "Просмотры вакансий", value: "0", percentage: 0 },
  { name: "Заявки на менторство", value: "0", percentage: 0 },
  { name: "Прохождение кейсов", value: "0", percentage: 0 },
  { name: "Завершение курсов", value: "0", percentage: 0 },
]);

const fetchStats = async () => {
  try {
    const response = await api["client"].get("/admin/analytics/stats");
    const data = response.data;
    stats.value[0].value = data.totalUsers.toString();
    stats.value[1].value = data.activeUsers.toString();
    stats.value[2].value = data.totalJobs.toString();
    stats.value[3].value = data.totalMentors.toString();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }
};

const fetchVisitors = async () => {
  try {
    const response = await api["client"].get("/admin/analytics/visitors");
    visitorsChart.value = response.data;
  } catch (error) {
    console.error("Failed to fetch visitors:", error);
  }
};

const fetchActivity = async () => {
  try {
    const response = await api["client"].get("/admin/analytics/activity");
    if (response.data.data) {
      activityData.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch activity:", error);
  }
};

onMounted(() => {
  fetchStats();
  fetchVisitors();
  fetchActivity();
});
</script>
