// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage.vue";
import CbsePage from "../views/CbsePage.vue";
import SubjectsPage from "../views/SubjectsPage.vue";
import TextbooksPage from "../views/TextbooksPage.vue";

// Subject-specific content pages
import MathematicsContentPage from "../views/subjects/MathematicsContentPage.vue";
import ScienceContentPage from "../views/subjects/ScienceContentPage.vue";
import SocialScienceContentPage from "../views/subjects/SocialScienceContentPage.vue";
import EnglishContentPage from "../views/subjects/EnglishContentPage.vue";
import KannadaContentPage from "../views/subjects/KannadaContentPage.vue";
import HindiContentPage from "../views/subjects/HindiContentPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
  },
  {
    path: "/cbse",
    name: "CBSE",
    component: CbsePage,
  },
  {
    path: "/class/:classNum/subjects",
    name: "Subjects",
    component: SubjectsPage,
  },
  {
    path: "/class/:classNum/subject/:subject",
    name: "Textbooks",
    component: TextbooksPage,
  },
  // Mathematics content route
  {
    path: "/class/:classNum/subject/mathematics/textbook/:textbookId/chapter/:chapterId",
    name: "MathematicsContent",
    component: MathematicsContentPage,
  },
  // Science content route
  {
    path: "/class/:classNum/subject/science/textbook/:textbookId/chapter/:chapterId",
    name: "ScienceContent",
    component: ScienceContentPage,
  },
  // Social Science content route
  {
    path: "/class/:classNum/subject/social-science/textbook/:textbookId/chapter/:chapterId",
    name: "SocialScienceContent",
    component: SocialScienceContentPage,
  },
  // English content route
  {
    path: "/class/:classNum/subject/english/textbook/:textbookId/chapter/:chapterId",
    name: "EnglishContent",
    component: EnglishContentPage,
  },
  // Kannada content route
  {
    path: "/class/:classNum/subject/kannada/textbook/:textbookId/chapter/:chapterId",
    name: "KannadaContent",
    component: KannadaContentPage,
  },
  // Hindi content route
  {
    path: "/class/:classNum/subject/hindi/textbook/:textbookId/chapter/:chapterId",
    name: "HindiContent",
    component: HindiContentPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
