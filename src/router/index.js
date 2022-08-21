import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/IndexView.vue'
import AboutMe from '@/views/AboutMeView.vue'
import OwnedSkills from '@/views/OwnedSkillsView.vue'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/aboutme',
    component: AboutMe
  },
  {
    path: '/skills',
    component: OwnedSkills
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
