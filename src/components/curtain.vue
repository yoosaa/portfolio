<template>
      <div class="curtain" :class='this.class'></div>
</template>

<script>
export default {
    data: function(){
        return {
            isOpen: true,
      class: 'js-open'
        }
    },
    methods:{
    close: function(){
      this.class = 'js-close'
    },
    open: function(){
      this.class = 'js-open'
    }
  },
  watch: {
    'isOpen': function(){
      this.isOpen ? this.open() : this.close()
    }
  },
   mounted: function(){

    this.$router.beforeEach((to, from , next)=>{
      this.isOpen = false
      console.log(to, from)
      next()
    })

    this.$router.afterEach(()=>{
      setTimeout(()=>{
        this.isOpen = true
      }, 400)
    })

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