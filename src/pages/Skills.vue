<template>
  <div class="space-y-6">
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-2xl font-semibold text-slate-800">Мои навыки</h2>
      <p class="text-slate-600">
        Выберите сферы интересов и отметьте навыки, которыми вы владеете
      </p>
    </section>

    <!-- Выбор сфер интересов -->
    <section class="rounded-lg bg-white p-6 shadow-sm">
      <h3 class="mb-4 text-lg font-medium text-slate-800">Сферы интересов</h3>
      <p class="mb-4 text-sm text-slate-600">
        Нажмите на категорию, чтобы раскрыть/скрыть навыки
      </p>
      <div class="space-y-3">
        <div
          v-for="category in categories"
          :key="category.id"
          class="border-2 rounded-lg transition-all"
          :class="[
            expandedCategories.includes(category.id)
              ? 'border-accent-2 bg-accent-2/5'
              : 'border-slate-200',
          ]"
        >
          <button
            @click="toggleCategory(category.id)"
            class="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 rounded-lg transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl font-bold text-slate-600">{{
                category.icon
              }}</span>
              <span class="font-medium text-slate-700">{{
                category.name
              }}</span>
              <span
                v-if="getCategorySelectedCount(category.id) > 0"
                class="text-sm text-accent-2 font-medium"
              >
                ({{ getCategorySelectedCount(category.id) }})
              </span>
            </div>
            <svg
              class="w-5 h-5 text-slate-500 transition-transform"
              :class="{
                'rotate-180': expandedCategories.includes(category.id),
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Список навыков категории -->
          <div
            v-if="expandedCategories.includes(category.id)"
            class="px-4 pb-4 pt-2 border-t"
          >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(skill, skillName) in categorySkills[category.id]"
                :key="skillName"
                @click="toggleSkill(category.id, skillName)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all border-2',
                  skill.selected
                    ? 'bg-accent-2 text-white border-accent-2'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-accent-2',
                ]"
              >
                {{ skillName }}
                <span
                  v-if="skill.selected && skill.level"
                  class="ml-1 text-xs opacity-90"
                >
                  {{ getLevelShort(skill.level) }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно для выбора уровня -->
    <div
      v-if="selectedSkillForLevel"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="selectedSkillForLevel = null"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h4 class="text-lg font-semibold mb-4">
          Уровень владения: {{ selectedSkillForLevel.skillName }}
        </h4>
        <div class="space-y-2">
          <button
            v-for="level in levels"
            :key="level.value"
            @click="setSkillLevelAndClose(level.value)"
            class="w-full px-4 py-3 rounded-lg border-2 text-left transition-all hover:border-accent-2"
            :class="
              categorySkills[selectedSkillForLevel.categoryId]?.[
                selectedSkillForLevel.skillName
              ]?.level === level.value
                ? 'border-accent-2 bg-accent-2/5'
                : 'border-slate-200'
            "
          >
            <div class="font-medium">{{ level.label }}</div>
            <div class="text-sm text-slate-600">{{ level.stars }}</div>
          </button>
        </div>
        <button
          @click="selectedSkillForLevel = null"
          class="mt-4 w-full px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          Отмена
        </button>
      </div>
    </div>

    <!-- Сводка выбранных навыков -->
    <section
      v-if="selectedSkillsCount > 0"
      class="rounded-lg bg-white p-6 shadow-sm"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-medium text-slate-800">
          Выбранные навыки ({{ selectedSkillsCount }})
        </h3>
        <div class="flex gap-2">
          <button
            @click="clearAllSkills"
            class="text-sm text-slate-600 hover:text-slate-800 px-3 py-1 rounded border border-slate-300 hover:border-slate-400"
          >
            Очистить все
          </button>
          <button
            @click="saveSkills"
            :disabled="isSaving || selectedSkillsCount === 0"
            class="rounded bg-accent-2 px-6 py-2 text-sm text-white hover:bg-accent-2/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? "Сохранение..." : "Сохранить" }}
          </button>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="(skills, categoryId) in selectedSkillsByCategory"
          :key="categoryId"
        >
          <div class="text-sm font-medium text-slate-600 mb-2">
            {{ getCategoryName(categoryId) }}
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, skillName) in skills"
              :key="skillName"
              class="inline-flex items-center gap-1.5 rounded-full bg-accent-2/10 border border-accent-2/30 px-3 py-1.5 text-sm font-medium text-accent-2"
            >
              {{ skillName }}
              <span
                v-if="skill.level"
                class="text-xs opacity-75"
                :title="getLevelTitle(skill.level)"
              >
                {{ getLevelShort(skill.level) }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { SkillCategory, SkillLevel } from "@/types";
import api from "@/services/api";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { isAuthenticated } = useAuth();

const categories = ref<SkillCategory[]>([
  {
    id: "backend",
    name: "Backend",
    icon: "BE",
    skills: [
      "Java",
      "Spring Boot",
      "Spring Framework",
      "Hibernate",
      "JPA",
      "Python",
      "Django",
      "Flask",
      "FastAPI",
      "Node.js",
      "Express.js",
      "NestJS",
      "PHP",
      "Laravel",
      "Symfony",
      "C#",
      ".NET Core",
      "ASP.NET",
      "Ruby",
      "Ruby on Rails",
      "Go",
      "Gin",
      "Fiber",
      "Kotlin",
      "Ktor",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "Oracle",
      "MS SQL Server",
      "MongoDB",
      "Redis",
      "Cassandra",
      "Elasticsearch",
      "REST API",
      "GraphQL",
      "gRPC",
      "WebSocket",
      "Microservices",
      "SOA",
      "DDD",
      "RabbitMQ",
      "Kafka",
      "NATS",
      "JWT",
      "OAuth2",
      "Security",
      "Unit Testing",
      "Integration Testing",
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    icon: "FE",
    skills: [
      "HTML5",
      "CSS3",
      "SCSS",
      "SASS",
      "LESS",
      "JavaScript",
      "ES6+",
      "TypeScript",
      "React",
      "React Hooks",
      "Redux",
      "Redux Toolkit",
      "MobX",
      "Zustand",
      "Vue.js",
      "Vue 3",
      "Vuex",
      "Pinia",
      "Nuxt.js",
      "Angular",
      "RxJS",
      "NgRx",
      "Svelte",
      "SvelteKit",
      "Next.js",
      "Gatsby",
      "Remix",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Ant Design",
      "Chakra UI",
      "Webpack",
      "Vite",
      "Rollup",
      "esbuild",
      "Parcel",
      "npm",
      "yarn",
      "pnpm",
      "jQuery",
      "Lodash",
      "Responsive Design",
      "Mobile First",
      "CSS Grid",
      "Flexbox",
      "CSS Animations",
      "Web Accessibility",
      "ARIA",
      "WCAG",
      "PWA",
      "Service Workers",
      "Jest",
      "Vitest",
      "Cypress",
      "Playwright",
      "Testing Library",
      "SEO",
      "Web Performance",
    ],
  },
  {
    id: "data",
    name: "Data Science",
    icon: "DS",
    skills: [
      "Python",
      "R",
      "Julia",
      "MATLAB",
      "Pandas",
      "NumPy",
      "SciPy",
      "Matplotlib",
      "Seaborn",
      "Plotly",
      "Bokeh",
      "Scikit-learn",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "JAX",
      "Jupyter",
      "JupyterLab",
      "Google Colab",
      "SQL",
      "NoSQL",
      "BigQuery",
      "Snowflake",
      "Apache Spark",
      "PySpark",
      "Hadoop",
      "Hive",
      "Data Visualization",
      "Tableau",
      "Power BI",
      "Looker",
      "Statistics",
      "Probability",
      "Linear Algebra",
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Feature Engineering",
      "Model Deployment",
      "A/B Testing",
      "Hypothesis Testing",
      "Time Series",
      "Forecasting",
      "ETL",
      "Data Pipeline",
      "Airflow",
      "Docker",
      "MLflow",
      "Kubeflow",
    ],
  },
  {
    id: "mobile",
    name: "Mobile Dev",
    icon: "MB",
    skills: [
      "Swift",
      "SwiftUI",
      "UIKit",
      "Combine",
      "Kotlin",
      "Jetpack Compose",
      "Android SDK",
      "React Native",
      "Expo",
      "Flutter",
      "Dart",
      "Xamarin",
      "MAUI",
      "Ionic",
      "Cordova",
      "Capacitor",
      "iOS Development",
      "Xcode",
      "TestFlight",
      "Android Development",
      "Android Studio",
      "Gradle",
      "Mobile UI/UX",
      "Material Design",
      "Human Interface Guidelines",
      "Firebase",
      "Firebase Auth",
      "Firestore",
      "Cloud Messaging",
      "Push Notifications",
      "Deep Linking",
      "App Store",
      "Google Play",
      "App Distribution",
      "Core Data",
      "Room",
      "Realm",
      "SQLite",
      "REST API",
      "GraphQL",
      "XCTest",
      "Espresso",
      "Detox",
      "App Performance",
      "Crash Analytics",
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    icon: "DO",
    skills: [
      "Docker",
      "Docker Compose",
      "Dockerfile",
      "Kubernetes",
      "Helm",
      "K8s",
      "Minikube",
      "CI/CD",
      "Jenkins",
      "GitHub Actions",
      "GitLab CI",
      "CircleCI",
      "Travis CI",
      "Terraform",
      "Pulumi",
      "CloudFormation",
      "Ansible",
      "Chef",
      "Puppet",
      "SaltStack",
      "AWS",
      "EC2",
      "S3",
      "Lambda",
      "ECS",
      "EKS",
      "RDS",
      "CloudWatch",
      "Azure",
      "Azure DevOps",
      "Azure Functions",
      "Google Cloud",
      "GCP",
      "Cloud Run",
      "GKE",
      "Linux",
      "Ubuntu",
      "CentOS",
      "RHEL",
      "Debian",
      "Bash",
      "Shell Scripting",
      "PowerShell",
      "Nginx",
      "Apache",
      "HAProxy",
      "Traefik",
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "Datadog",
      "New Relic",
      "Git",
      "GitOps",
      "ArgoCD",
      "Flux",
      "Networking",
      "DNS",
      "Load Balancing",
      "Security",
      "SSL/TLS",
      "Vault",
    ],
  },
  {
    id: "qa",
    name: "QA/Testing",
    icon: "QA",
    skills: [
      "Manual Testing",
      "Test Cases",
      "Test Plans",
      "Automated Testing",
      "Test Automation",
      "Selenium",
      "Selenium WebDriver",
      "Cypress",
      "Playwright",
      "Puppeteer",
      "TestCafe",
      "Jest",
      "Mocha",
      "Jasmine",
      "Vitest",
      "JUnit",
      "TestNG",
      "PyTest",
      "unittest",
      "Postman",
      "API Testing",
      "REST Assured",
      "Performance Testing",
      "Load Testing",
      "JMeter",
      "Gatling",
      "k6",
      "Appium",
      "Detox",
      "XCUITest",
      "Espresso",
      "BDD",
      "Cucumber",
      "SpecFlow",
      "Behave",
      "Test Management",
      "TestRail",
      "Zephyr",
      "Xray",
      "Bug Tracking",
      "JIRA",
      "Bugzilla",
      "Mantis",
      "CI/CD",
      "Jenkins",
      "GitHub Actions",
      "SQL",
      "Database Testing",
      "Security Testing",
      "Penetration Testing",
      "Accessibility Testing",
      "WCAG",
      "Regression Testing",
      "Smoke Testing",
      "Sanity Testing",
    ],
  },
  {
    id: "ux",
    name: "UX/UI Design",
    icon: "UI",
    skills: [
      "Figma",
      "FigJam",
      "Prototyping",
      "Adobe XD",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Sketch",
      "InVision",
      "Zeplin",
      "User Research",
      "User Interviews",
      "Surveys",
      "Wireframing",
      "Low-fidelity",
      "High-fidelity",
      "Interactive Prototypes",
      "Design Systems",
      "Component Libraries",
      "Style Guides",
      "Usability Testing",
      "A/B Testing",
      "User Testing",
      "Information Architecture",
      "IA",
      "Sitemaps",
      "Interaction Design",
      "IxD",
      "Microinteractions",
      "User Flow",
      "User Journey Mapping",
      "Personas",
      "Empathy Mapping",
      "Design Thinking",
      "Human-Centered Design",
      "Accessibility",
      "Inclusive Design",
      "WCAG",
      "Mobile Design",
      "Responsive Design",
      "Typography",
      "Color Theory",
      "Layout",
      "Material Design",
      "iOS Guidelines",
      "HTML/CSS",
      "Frontend Basics",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "CS",
    skills: [
      "Network Security",
      "Firewall",
      "IDS/IPS",
      "Penetration Testing",
      "Ethical Hacking",
      "Bug Bounty",
      "Cryptography",
      "Encryption",
      "PKI",
      "Security Auditing",
      "Vulnerability Assessment",
      "SIEM",
      "Splunk",
      "QRadar",
      "ELK",
      "Incident Response",
      "Forensics",
      "Malware Analysis",
      "Web Application Security",
      "OWASP Top 10",
      "API Security",
      "REST Security",
      "OAuth2",
      "Cloud Security",
      "AWS Security",
      "Azure Security",
      "Compliance",
      "GDPR",
      "ISO 27001",
      "SOC 2",
      "PCI DSS",
      "Threat Intelligence",
      "Threat Hunting",
      "Security Testing",
      "Burp Suite",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Identity Management",
      "IAM",
      "SSO",
      "MFA",
      "Zero Trust",
      "Network Segmentation",
      "Kali Linux",
      "Parrot OS",
      "Python",
      "Bash",
      "PowerShell",
      "Security Awareness",
      "Social Engineering",
    ],
  },
]);

const levels = [
  { value: "beginner" as SkillLevel, label: "Beginner", stars: "★" },
  { value: "intermediate" as SkillLevel, label: "Intermediate", stars: "★★" },
  { value: "advanced" as SkillLevel, label: "Advanced", stars: "★★★" },
];

const expandedCategories = ref<string[]>([]);
const categorySkills = ref<
  Record<string, Record<string, { selected: boolean; level?: SkillLevel }>>
>({});
const isSaving = ref(false);
const isLoading = ref(true);
const selectedSkillForLevel = ref<{
  categoryId: string;
  skillName: string;
} | null>(null);

// Initialize skills structure for all categories
const initializeCategorySkills = () => {
  categories.value.forEach((category) => {
    if (!categorySkills.value[category.id]) {
      categorySkills.value[category.id] = {};
      category.skills.forEach((skillName) => {
        categorySkills.value[category.id][skillName] = {
          selected: false,
          level: undefined,
        };
      });
    }
  });
};

const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryId);
  }
};

const toggleSkill = (categoryId: string, skillName: string) => {
  const skill = categorySkills.value[categoryId][skillName];
  if (skill.selected) {
    // Deselect skill
    skill.selected = false;
    skill.level = undefined;
  } else {
    // Select skill and open modal to choose level
    skill.selected = true;
    selectedSkillForLevel.value = { categoryId, skillName };
  }
};

const setSkillLevelAndClose = (level: SkillLevel) => {
  if (selectedSkillForLevel.value) {
    const { categoryId, skillName } = selectedSkillForLevel.value;
    categorySkills.value[categoryId][skillName].level = level;
    selectedSkillForLevel.value = null;
  }
};

const getCategorySelectedCount = (categoryId: string) => {
  const skills = categorySkills.value[categoryId];
  if (!skills) return 0;
  return Object.values(skills).filter((s) => s.selected).length;
};

const getCategoryName = (categoryId: string) => {
  return categories.value.find((c) => c.id === categoryId)?.name || categoryId;
};

const getLevelShort = (level?: SkillLevel) => {
  if (!level) return "";
  const map = { beginner: "1", intermediate: "2", advanced: "3" };
  return map[level] || "";
};

const getLevelTitle = (level?: SkillLevel) => {
  if (!level) return "";
  const map = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return map[level] || "";
};

const selectedSkillsCount = computed(() => {
  let count = 0;
  Object.values(categorySkills.value).forEach((skills) => {
    count += Object.values(skills).filter((s) => s.selected).length;
  });
  return count;
});

const selectedSkillsByCategory = computed(() => {
  const result: Record<string, Record<string, { level?: SkillLevel }>> = {};
  Object.entries(categorySkills.value).forEach(([categoryId, skills]) => {
    const selectedInCategory: Record<string, { level?: SkillLevel }> = {};
    Object.entries(skills).forEach(([skillName, skill]) => {
      if (skill.selected) {
        selectedInCategory[skillName] = { level: skill.level };
      }
    });
    if (Object.keys(selectedInCategory).length > 0) {
      result[categoryId] = selectedInCategory;
    }
  });
  return result;
});

const clearAllSkills = () => {
  Object.values(categorySkills.value).forEach((skills) => {
    Object.values(skills).forEach((skill) => {
      skill.selected = false;
      skill.level = undefined;
    });
  });
};

const saveSkills = async () => {
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    alert("Для сохранения навыков необходимо войти в аккаунт");
    router.push("/login");
    return;
  }

  if (selectedSkillsCount.value === 0) {
    alert("Выберите хотя бы один навык");
    return;
  }

  // Prepare data for saving - array of categories with skills
  const skillsData: Array<{
    category: string;
    skills: Array<{ name: string; level: string }>;
  }> = [];

  Object.entries(selectedSkillsByCategory.value).forEach(
    ([categoryId, skills]) => {
      skillsData.push({
        category: categoryId,
        skills: Object.entries(skills).map(([skillName, skill]) => ({
          name: skillName,
          level: skill.level || "beginner",
        })),
      });
    }
  );

  isSaving.value = true;
  try {
    await api.saveSkills(JSON.stringify(skillsData));
    alert(
      `Сохранено ${selectedSkillsCount.value} навыков из ${skillsData.length} категорий!`
    );
  } catch (error: any) {
    // If 401 error (Unauthorized)
    if (error.status === 401) {
      alert("Сессия истекла. Пожалуйста, войдите снова");
      router.push("/login");
    } else {
      alert(`Ошибка сохранения: ${error.message}`);
    }
  } finally {
    isSaving.value = false;
  }
};

// Load saved skills from profile
const loadSavedSkills = async () => {
  // Проверяем авторизацию перед загрузкой
  if (!isAuthenticated.value) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const profile = await api.getProfile();
    if (profile.skills) {
      const savedData = JSON.parse(profile.skills);

      // Support old format (single category)
      if (savedData.category && savedData.skills && !Array.isArray(savedData)) {
        const categoryId = savedData.category;
        if (categorySkills.value[categoryId]) {
          savedData.skills.forEach(
            (saved: { name: string; level: SkillLevel }) => {
              if (categorySkills.value[categoryId][saved.name]) {
                categorySkills.value[categoryId][saved.name].selected = true;
                categorySkills.value[categoryId][saved.name].level =
                  saved.level;
              }
            }
          );
          expandedCategories.value.push(categoryId);
        }
      }
      // New format (array of categories)
      else if (Array.isArray(savedData)) {
        savedData.forEach(
          (categoryData: {
            category: string;
            skills: Array<{ name: string; level: SkillLevel }>;
          }) => {
            const categoryId = categoryData.category;
            if (categorySkills.value[categoryId]) {
              categoryData.skills.forEach((saved) => {
                if (categorySkills.value[categoryId][saved.name]) {
                  categorySkills.value[categoryId][saved.name].selected = true;
                  categorySkills.value[categoryId][saved.name].level =
                    saved.level;
                }
              });
              expandedCategories.value.push(categoryId);
            }
          }
        );
      }
    }
  } catch (error: any) {
    // If 401 error, don't show error, just don't load
    if (error.status !== 401) {
      console.log("Error loading saved skills:", error);
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  initializeCategorySkills();
  loadSavedSkills();
});
</script>
