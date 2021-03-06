<template>
    <nav class="gnav fixed">
      <ul class="gnav-list">
        <li class="gnav-item"><router-link to="/" class="gnav-link">HOME</router-link></li>
        <li class="gnav-item"><router-link to="/about" class="gnav-link">ABOUT</router-link></li>
        <li class="gnav-item"><router-link to="/skills" class="gnav-link">SKILL</router-link></li>
        <li class="gnav-item"><router-link to="/contact" class="gnav-link">CONTACT</router-link></li>
      </ul>
    </nav>
</template>

<style>
  .gnav{
    z-index: 2;
  }
</style>
