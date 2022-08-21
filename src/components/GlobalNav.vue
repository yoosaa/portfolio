<template>
  <nav class="gnav fixed">
    <ul class="gnav-list">
      <li class="gnav-item">
        <router-link class="gnav-link" data-text="HOME"
          to="/"
        >HOME</router-link>
      </li>
      <li class="gnav-item">
        <router-link class="gnav-link" data-text="ABOUT"
          to="/aboutme"
        >ABOUT ME</router-link>
      </li>
      <li class="gnav-item">
        <router-link class="gnav-link" data-text="SKILL"
          to="/skills"
        >SKILL</router-link>
      </li>
      <li class="gnav-item">
        <router-link class="gnav-link" data-text="CONTACT"
          to="/contact"
        >CONTACT</router-link>
      </li>
    </ul>
  </nav>
</template>

<style>
.gnav{
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
