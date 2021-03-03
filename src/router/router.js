import Vue from 'vue'
import Router from 'vue-router'

import MainVidual from '@/views/parts/MainVidual.vue'
import About from '@/views/contents/About.vue'
import Skills from '@/views/contents/Skills.vue'
import Contact from '@/views/contents/Contact.vue'


Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'index',
            props: true,
            component: MainVidual
        },
        {
            path: '/about',
            name: 'about',
            props: true,
            component: About
        },
        {
            path: '/skills',
            name: 'skills',
            props: true,
            component: Skills
        },
        {
            path: '/contact',
            name: 'contact',
            props: true,
            component: Contact
        },
    ]
})