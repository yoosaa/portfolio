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
    meta: [
      { property: 'og:type', content: 'website'},
      { property: 'og:title', content: 'portfolio'},
      { property: 'og:url', content: 'https://yoosaa.github.io/portfolio-s/'},
      { property: 'og:description', content: 'とあるフロントエンドのポートフォリオ'},
    ],
    link: [
      {rel: 'canonical', href: 'https://yoosaa.github.io/portfolio-s/'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:700'},
    ]
  },
  components: {
    BackGround,
    GlobalNav,
    MainContents,
    Curtain
  },
   methods : {
    createTitleDesc : function(routeInstance){
         // タイトルを設定
        if(routeInstance.meta.title){
            var setTitle = routeInstance.meta.title;
            document.title = setTitle;
        } else {
            document.title = 'portfolio'
        }

        // メタタグdescription設定
        if(routeInstance.meta.desc){
            var setDesc = routeInstance.meta.desc;
            document.querySelector("meta[name='description']").setAttribute('content', setDesc)
        } else {
            document.querySelector("meta[name='description']").setAttribute('content', 'description is not set')
        }
    },
   },
   mounted : function(){
      var routeInstance = this.$route;
      this.createTitleDesc(routeInstance);
  },
  watch: {
      '$route' (routeInstance) {
          this.createTitleDesc(routeInstance);
      }
  }
}
</script>

<style>
@import "../css/reset.css";
@import "../css/style.css";
@import "../css/txt_noize.css";
</style>
