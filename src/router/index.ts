import { createRouter, createWebHashHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";

import Layout from "@/components/Layout.vue";
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Profile from "@/pages/Profile.vue";
import Skills from "@/pages/Skills.vue";
import Recommendations from "@/pages/Recommendations.vue";
import Mentors from "@/pages/Mentors.vue";
import MentorReviews from "@/pages/MentorReviews.vue";
import Cases from "@/pages/Cases.vue";
import VerifyEmail from "@/pages/VerifyEmail.vue";
import Admin from "@/pages/Admin.vue";

const routes = [
  {
    path: "/admin",
    component: Admin,
    name: "admin",
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", component: Home, name: "home" },
      { path: "login", component: Login, name: "login" },
      { path: "register", component: Register, name: "register" },
      { path: "verify-email", component: VerifyEmail, name: "verify-email" },
      {
        path: "profile",
        component: Profile,
        name: "profile",
        meta: { requiresAuth: true },
      },
      { path: "skills", component: Skills, name: "skills" },
      {
        path: "recommendations",
        component: Recommendations,
        name: "recommendations",
      },
      { path: "mentors", component: Mentors, name: "mentors" },
      {
        path: "mentors/:id/reviews",
        component: MentorReviews,
        name: "mentor-reviews",
      },
      { path: "cases", component: Cases, name: "cases" },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuth();
  auth.loadAuthFromStorage();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: "login" };
  }

  if (to.meta.requiresAdmin && auth.user.value?.role !== "ADMIN") {
    return { name: "home" };
  }
});

export default router;
