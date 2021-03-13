<template>
    <header class="header animate">
      <h1 class="logo">
        <div>
          <vue-typer
            text='YOSHITAKA SANO'
            :repeat='0'
            :pre-type-delay='600'
            caret-animation='blink'
            :type-delay='80'
            class="logo-title noise"
            data-text="YOSHITAKA SANO">
          </vue-typer>
        </div>

        <div>
          <vue-typer
          text='PORTFOLIO'
          :repeat='0'
          :pre-type-delay='600'
          caret-animation='blink'
          :type-delay='80'
          class="logo-subtitle noise"
          data-text="PORTFOLIO">
          </vue-typer>
        </div>
      </h1>
    </header>
</template>