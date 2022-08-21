<template>
  <BackGround />
  <main class="wrapper content"
    v-cloak
  >
    <GlobalNav />
    <TransitionCurtain />
    <router-view v-slot="{ Component }">
      <transition
        name="router-transition"
        :duration="transition.duration"
        :enter-active-class="transition.enter"
        :leave-active-class="transition.leave"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script>
import BackGround from '@/components/BackgroundNoise.vue'
import TransitionCurtain from '@/components/TransitionCurtain.vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default {
  components: {
    BackGround,
    GlobalNav,
    TransitionCurtain
  },
  setup () {
    const transition = {
      duration: 300,
      enter: 'animate__animated animate__fadeInRight',
      leave: 'animate__animated animate__fadeOutRight'
    }

    return { transition }
  }
}
</script>

<style lang="scss">
.animate{
  position: fixed;
  right: 0;
  left: 0;
  width: inherit;
  height: 100%;
  overflow: scroll;
  padding: 16px;
}
@media screen and (min-width: 768px) {
  .animate {
    padding: 0 50px;
  }
}
</style>
