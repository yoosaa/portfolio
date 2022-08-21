<template>
  <nav class="gnav fixed">
    <ul class="gnav-list">
      <li class="gnav-item">
        <router-link class="gnav-link"
          to="/"
        >HOME</router-link>
      </li>
      <li class="gnav-item">
        <router-link class="gnav-link"
          to="/aboutme"
        >ABOUT ME</router-link>
      </li>
      <li class="gnav-item">
        <router-link class="gnav-link"
          to="/skills"
        >SKILL</router-link>
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
  font-weight: 600;
}
</style>
