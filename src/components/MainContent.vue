<template>
    <main class="content">
      <transition
      name="router-transition"
      :duration="transition.duration"
      :enter-active-class="transition.enter"
      :leave-active-class="transition.leave"
      >

        <router-view />

      </transition>
    </main>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      transition: {
        enter: 'animate__animated animate__bounceIn',
        leave: 'animate__animated animate__fadeOutRight',
        duration: 400,
      },
    }
  }
};
</script>

<style>
  .animate{
    position: fixed;
    right: 0;
    left: 0;
    width: inherit;
    height: 100%;
    overflow: scroll;
    padding: 0 50px;
  }
</style>