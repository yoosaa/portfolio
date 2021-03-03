import Vue from 'vue'
import router from '@/router/router'

import VueHead from "vue-head"
import AnimateCss from 'animate.css'

import Index from './views/Index.vue'


Vue.config.productionTip = false

Vue.use(VueHead)
Vue.use(AnimateCss)

new Vue({
    router,
    render: h => h(Index),
}).$mount('#app')