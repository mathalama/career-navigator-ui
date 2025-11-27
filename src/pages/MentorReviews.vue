<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button @click="goBack" class="text-slate-600 hover:text-slate-900">
        ← Назад
      </button>
      <h2 class="text-xl font-semibold text-slate-900">Отзывы о менторе</h2>
    </div>

    <div v-if="mentor" class="bg-white rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-medium text-slate-900">{{ mentor.name }}</h3>
      <p class="text-sm text-slate-600">{{ mentor.role }}</p>
      <p class="text-sm text-slate-500 mt-1">{{ mentor.area }}</p>
      <div class="mt-3 flex items-center gap-2">
        <div class="flex items-center">
          <span v-for="i in 5" :key="i" class="text-yellow-400">
            {{ i <= averageRating ? "★" : "☆" }}
          </span>
        </div>
        <span class="text-sm text-slate-600"
          >{{ averageRating.toFixed(1) }} ({{ reviews.length }} отзывов)</span
        >
      </div>
    </div>

    <div v-if="isAuthenticated" class="bg-white rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-medium text-slate-900 mb-4">Оставить отзыв</h3>
      <form @submit.prevent="submitReview" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Оценка
          </label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="newReview.rating = i"
              class="text-2xl"
              :class="
                i <= newReview.rating ? 'text-yellow-400' : 'text-slate-300'
              "
            >
              ★
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Комментарий
          </label>
          <textarea
            v-model="newReview.comment"
            rows="4"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Расскажите о своём опыте работы с ментором..."
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="!newReview.rating || submitting"
          class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? "Отправка..." : "Отправить отзыв" }}
        </button>
      </form>
    </div>

    <div v-else class="bg-slate-50 rounded-lg p-6 text-center">
      <p class="text-slate-600">
        <a href="#/login" class="text-accent hover:underline">Войдите</a>, чтобы
        оставить отзыв
      </p>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium text-slate-900">
        Отзывы ({{ reviews.length }})
      </h3>

      <div v-if="loading" class="text-center py-8 text-slate-500">
        Загрузка отзывов...
      </div>

      <div
        v-else-if="reviews.length === 0"
        class="text-center py-8 text-slate-500"
      >
        Пока нет отзывов
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="bg-white rounded-lg p-6 shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-medium text-slate-900">{{
                  review.userName
                }}</span>
                <div class="flex items-center">
                  <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                    {{ i <= review.rating ? "★" : "☆" }}
                  </span>
                </div>
              </div>
              <p class="text-sm text-slate-600 mb-2">{{ review.comment }}</p>
              <p class="text-xs text-slate-400">
                {{ formatDate(review.createdAt) }}
              </p>
            </div>
            <button
              v-if="canDeleteReview(review)"
              @click="deleteReview(review.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { isAuthenticated, user } = useAuth();

const mentorId = ref<number>(Number(route.params.id));
const mentor = ref<any>(null);
const reviews = ref<any[]>([]);
const loading = ref(false);
const submitting = ref(false);

const newReview = ref({
  rating: 0,
  comment: "",
});

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.value.length;
});

const fetchMentor = async () => {
  try {
    const response = await api["client"].get(`/mentors`);
    mentor.value = response.data.find((m: any) => m.id === mentorId.value);
  } catch (error) {
    console.error("Failed to fetch mentor:", error);
  }
};

const fetchReviews = async () => {
  loading.value = true;
  try {
    const response = await api["client"].get(
      `/reviews/mentor/${mentorId.value}`
    );
    reviews.value = response.data;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!newReview.value.rating) return;

  submitting.value = true;
  try {
    await api["client"].post("/reviews", {
      mentorId: mentorId.value,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
    });

    newReview.value = { rating: 0, comment: "" };
    await fetchReviews();
  } catch (error) {
    console.error("Failed to submit review:", error);
    alert("Не удалось отправить отзыв");
  } finally {
    submitting.value = false;
  }
};

const deleteReview = async (reviewId: number) => {
  if (!confirm("Удалить отзыв?")) return;

  try {
    await api["client"].delete(`/reviews/${reviewId}`);
    await fetchReviews();
  } catch (error) {
    console.error("Failed to delete review:", error);
    alert("Не удалось удалить отзыв");
  }
};

const canDeleteReview = (review: any) => {
  if (!isAuthenticated.value) return false;
  return (
    review.userName === user.value?.username || user.value?.role === "ADMIN"
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goBack = () => {
  router.push("/mentors");
};

onMounted(() => {
  fetchMentor();
  fetchReviews();
});
</script>
