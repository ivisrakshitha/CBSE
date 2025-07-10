// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import CbsePage from '../views/CbsePage.vue'
import SubjectsPage from '../views/SubjectsPage.vue'
import TextbooksPage from '../views/TextbooksPage.vue'
import ContentPage from '../views/ContentPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/cbse',
    name: 'CBSE',
    component: CbsePage
  },
  {
    path: '/class/:classNum/subjects',
    name: 'Subjects',
    component: SubjectsPage
  },
  {
    path: '/class/:classNum/subject/:subject',
    name: 'Textbooks',
    component: TextbooksPage
  },
  {
    path: '/class/:classNum/subject/:subject/textbook/:textbookId/chapter/:chapterId',
    name: 'ChapterContent',
    component: ContentPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router