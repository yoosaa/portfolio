import { createApp } from 'vue'
import router from './router'

import BaseLayout from './BaseLayout.vue'

import 'animate.css'
import '@/assets/scss/global.scss'

createApp(BaseLayout).use(router).mount('#app')
