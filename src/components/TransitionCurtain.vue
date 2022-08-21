<template>
  <div class="curtain"
    :class='toggleClass'
  ></div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const toggleClass = ref('js-open')
    const isOpen = ref(true)
    const close = () => {
      toggleClass.value = 'js-close'
    }
    const open = () => {
      toggleClass.value = 'js-open'
    }

    watch(isOpen, () => {
      isOpen.value ? open() : close()
    })

    const router = useRouter()
    router.beforeEach((to, from, next) => {
      isOpen.value = false
      next()
    })
    router.afterEach(() => {
      setTimeout(() => {
        isOpen.value = true
      }, 400)
    })

    return { toggleClass }
  }
}
</script>

<style scoped>
.curtain{
  z-index: 1;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  transition: .1s;
  background-color: rgb(51, 51, 51);
}
.curtain.js-close{
  width: 100vw;
  left: 0;
}
.curtain.js-open{
  width: 0;
  right: 0;
}
</style>
