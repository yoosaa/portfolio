<template>
  <div id="app" class="wrapper content" v-cloak>
    <BackGround />
    <GlobalNav />
    <MainContents />
    <Curtain />
  </div>
</template>

<script>
import BackGround from '@/components/BackgroundNoise.vue'
import GlobalNav from '@/components/GlobalNav.vue'
import MainContents from '@/components/MainContent.vue'
import Curtain from '@/components/curtain.vue'

export default {
  name: 'Index',
  head: {
    title(){
      return {
        inner: "portfolio"
      }
    },
    meta: [
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0,user-scalable=no'},
      { name: 'description', content: ''},
      { property: 'og:type', content: 'website'},
      { property: 'og:title', content: 'website'},
      { property: 'og:url', content: 'website'},
      { property: 'og:image', content: 'website'},
      { property: 'og:description', content: 'website'},
    ],
    link: [
      {rel: 'canonical', href: ''},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:700'},
    ]
  },
  components: {
    BackGround,
    GlobalNav,
    MainContents,
    Curtain
  }
}
</script>

<style>
@import "../css/reset.css";
@import "../css/style.css";
@import "../css/txt_noize.css";
</style>
