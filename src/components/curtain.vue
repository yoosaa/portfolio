<template>
    <div>
        <div class="curtain_left" :class='this.class'></div>
        <div class="curtain_right" :class='this.class'></div>
    </div>
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
    .curtain_left,
    .curtain_right{
        z-index: 1;
        height: 100vh;
        position: fixed;
        top: 0;
        transition: .1s;
        background-color: rgb(51, 51, 51);
    }
    .curtain_left{
        left: 0;
    }
    .curtain_right{
        right: 0;
    }
    .curtain_left.js-close,
    .curtain_right.js-close{
        width: 50vw;
    }
    .curtain_left.js-open,
    .curtain_right.js-open{
        width: 0;
    }

</style>