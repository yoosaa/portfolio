<template>
  <section class="header animate">
    <div class="logo">
      <h1 class="logo-title noise" data-text="Yoshitaka Sano">Yoshitaka Sano</h1>
      <h1 class="logo-subtitle noise" data-text="PORTFOLIO">PORTFOLIO</h1>
    </div>
  </section>
</template>

<style lang="scss">
.header {
  .logo {
    width: 100%;
    position: relative;
    padding-bottom: 4rem;
    &-title {
      font-size: 2.6rem;
      position: absolute;
      letter-spacing: 0;
      top: 0;
      left: 0;
      opacity: .2;
    }
    &-subtitle {
      font-size: 1.8rem;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
@media screen and (min-width: 768px) {
  .header {
    .logo {
      padding-bottom: 10rem;
      &-title {
        font-size: 9.5rem;
      }
      &-subtitle {
        font-size: 3rem;
      }
    }
  }
}
</style>
