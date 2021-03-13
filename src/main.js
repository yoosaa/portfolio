import Vue from 'vue'
import router from '@/router/router'

import VueHead from "vue-head"
import AnimateCss from 'animate.css'
import VueTyperPlugin from 'vue-typer'

import Index from './views/Index.vue'


Vue.config.productionTip = false

Vue.use(VueHead)
Vue.use(AnimateCss)
Vue.use(VueTyperPlugin)

new Vue({
    router,
    render: h => h(Index),
}).$mount('#app')