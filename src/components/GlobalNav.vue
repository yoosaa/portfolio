<template>
    <nav class="gnav fixed">
      <ul class="gnav-list">
        <li class="gnav-item"><router-link to="/" class="gnav-link" data-text="HOME">HOME</router-link></li>
        <li class="gnav-item"><router-link to="/about" class="gnav-link" data-text="ABOUT">ABOUT</router-link></li>
        <li class="gnav-item"><router-link to="/skills" class="gnav-link" data-text="SKILL">SKILL</router-link></li>
        <li class="gnav-item"><router-link to="/contact" class="gnav-link" data-text="CONTACT">CONTACT</router-link></li>
      </ul>
    </nav>
</template>

<style>
  .gnav{
    z-index: 2;
  }
</style>
