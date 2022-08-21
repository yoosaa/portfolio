<template>
  <div class="font-opensans fz-30 mb-15 mt-48 font-center sub-title">
    <h2 class="sub-title-text noise"
      :data-text="titleText"
    >{{ titleText }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    titleText: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss">
.sub-title {
  position: relative;
  width: 100%;
  padding-bottom: .5rem;
  &-text {
    position: absolute!important;
    top: 0;
    left: 0;
    font-size: 2rem;
    opacity: .2;
    font-family: 'Work Sans', sans-serif;
  }
}
@media screen and (min-width: 768px) {
  .sub-title {
    padding-bottom: 3rem;
    &-text {
      font-size: 4rem;
    }
  }
}
</style>
